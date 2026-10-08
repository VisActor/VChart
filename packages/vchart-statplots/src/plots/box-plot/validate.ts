import type { BoxPlotSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { checkSeries, issue } from '../../common/validation';
export function validateBoxPlot(spec: BoxPlotSpec): StatPlotIssue[] {
  const errors = checkSeries(spec.data);
  let min = Infinity;
  let max = -Infinity;
  for (const row of spec.data) {
    min = Math.min(min, row.value);
    max = Math.max(max, row.value);
  }
  if (spec.data.length && !Number.isFinite(max - min)) {
    errors.push(issue('INVALID_RANGE', '/data', '轴域与插值跨度无法用有限数值表示，请先平移或转换单位'));
  }
  return errors;
}
