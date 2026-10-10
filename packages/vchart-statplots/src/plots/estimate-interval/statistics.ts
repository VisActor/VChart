import type { PointIntervalPlotSpec } from './types';
import type { SeriesRow } from '../../common/types';
import { summarizeSample } from '../../common/sample-estimate';
import { intervalLabel } from '../../common/interval';
import { issue } from '../../common/validation';
import { StatPlotValidationError } from '../../errors';
export interface PointIntervalSummary extends SeriesRow {
  category: string;
  estimate: number;
  lower: number | null;
  upper: number | null;
  interval: string;
  sampleCount?: number;
}
export function summarizePointIntervals(spec: PointIntervalPlotSpec): PointIntervalSummary[] {
  if (spec.input === 'estimates') {
    return spec.data.map(row => ({ ...row, interval: intervalLabel(spec.interval) }));
  }
  const groups = new Map<string, { category: string; series?: string; values: number[] }>();
  for (const row of spec.data) {
    const key = JSON.stringify([row.category, row.series]);
    let group = groups.get(key);
    if (!group) {
      group = { category: row.category, series: row.series, values: [] };
      groups.set(key, group);
    }
    group.values.push(row.value);
  }
  return Array.from(groups.values(), group => {
    const summary = summarizeSample(group.values, spec);
    const { estimate, lower } = summary;
    if (spec.valueScale === 'log' && (estimate <= 0 || (lower !== null && lower <= 0))) {
      throw new StatPlotValidationError([
        issue('UNSUPPORTED_COMBINATION', '/valueScale', 'log 轴的估计值和区间端点须为正')
      ]);
    }
    return { category: group.category, series: group.series, ...summary };
  });
}
