import { mean, variance } from '@visactor/vutils';
import type { LearningCurveSpec, LearningCurveRow } from './types';
import { intervalLabel } from '../../common/interval';
import { StatPlotValidationError } from '../../errors';
import { issue } from '../../common/validation';
export interface LearningSummary extends LearningCurveRow {
  lower?: number;
  upper?: number;
  interval?: string;
  foldCount?: number;
  standardDeviation?: number;
}
export function summarizeLearningCurve(spec: LearningCurveSpec): LearningSummary[] {
  if (spec.input === 'summaries') {
    return spec.data.map(row => ({ ...row, interval: spec.interval ? intervalLabel(spec.interval) : undefined }));
  }
  const groups = new Map<
    string,
    { trainSize: number; split: 'train' | 'validation'; series?: string; values: number[] }
  >();
  for (const row of spec.data) {
    const key = JSON.stringify([row.series, row.split, row.trainSize]);
    if (!groups.has(key)) {
      groups.set(key, { trainSize: row.trainSize, split: row.split, series: row.series, values: [] });
    }
    groups.get(key)!.values.push(row.score);
  }
  return Array.from(groups.values(), group => {
    const score = mean(group.values)!;
    const standardDeviation = Math.sqrt((variance(group.values) * (group.values.length - 1)) / group.values.length);
    const width = standardDeviation * (spec.spread === false ? 0 : spec.spread?.multiplier ?? 1);
    if (![score, standardDeviation, score - width, score + width].every(Number.isFinite)) {
      throw new StatPlotValidationError([
        issue('INVALID_RANGE', '/data', '均值或标准差带无法用有限数值表示，请转换单位')
      ]);
    }
    return {
      trainSize: group.trainSize,
      split: group.split,
      series: group.series,
      score,
      standardDeviation,
      foldCount: group.values.length,
      ...(spec.spread === false
        ? {}
        : {
            lower: score - width,
            upper: score + width,
            interval: intervalLabel({ kind: 'standardDeviation', multiplier: spec.spread?.multiplier ?? 1 })
          })
    };
  }).sort((a, b) => a.trainSize - b.trainSize);
}
