import type { PrecisionRecallCurveSpec } from './types';
import { buildBinaryThresholds } from '../../common/binary-classification';
export function computePrecisionRecall(spec: PrecisionRecallCurveSpec) {
  const values: {
    recall: number;
    precision: number;
    threshold?: number;
    series?: string;
    sampleCount: number;
    averagePrecision: number;
    positiveRate: number;
  }[] = [];
  const baselines: { recall: number; precision: number; series?: string }[] = [];
  for (const group of buildBinaryThresholds(spec.data)) {
    const points = [
      { recall: 0, precision: 1, threshold: undefined as number | undefined },
      ...group.counts.map(row => ({
        recall: row.tp / group.positiveCount,
        precision: row.tp / (row.tp + row.fp),
        threshold: row.threshold
      }))
    ];
    let averagePrecision = 0;
    for (let i = 1; i < points.length; i++)
      averagePrecision += (points[i].recall - points[i - 1].recall) * points[i].precision;
    const positiveRate = group.positiveCount / group.sampleCount;
    for (const row of points)
      values.push({ ...row, series: group.series, sampleCount: group.sampleCount, averagePrecision, positiveRate });
    if (spec.baseline)
      baselines.push(...[0, 1].map(recall => ({ recall, precision: positiveRate, series: group.series })));
  }
  return { values, baselines };
}
