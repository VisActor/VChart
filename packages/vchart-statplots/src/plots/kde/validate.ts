import type { KdePlotSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { checkSeries, issue, seriesGroups } from '../../common/validation';
export function validateKde(spec: KdePlotSpec): StatPlotIssue[] {
  const errors = checkSeries(spec.data);
  for (const points of seriesGroups(spec.data).values()) {
    points.forEach(({ row, index }, i) => {
      if (row.density < 0) {
        errors.push(issue('INVALID_RANGE', `/data/${index}/density`, '概率密度不能为负'));
      }
      if (i && row.value <= points[i - 1].row.value) {
        errors.push(issue('INVALID_ORDER', `/data/${index}/value`, '采样位置必须严格递增'));
      }
    });
  }
  if (spec.estimation && spec.estimation.bandwidth <= 0) {
    errors.push(issue('INVALID_RANGE', '/estimation/bandwidth', '带宽必须大于 0'));
  }
  return errors;
}
