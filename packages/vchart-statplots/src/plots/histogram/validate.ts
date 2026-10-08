import type { HistogramSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { checkSeries, checkCount, issue, seriesGroups } from '../../common/validation';

export function validateHistogram(spec: HistogramSpec): StatPlotIssue[] {
  const errors = checkSeries(spec.data);
  for (const points of seriesGroups(spec.data).values()) {
    const width = points[0].row.binEnd - points[0].row.binStart;
    points.forEach(({ row, index }, i) => {
      errors.push(...checkCount(row.count, `/data/${index}/count`));
      if (row.binEnd <= row.binStart) {
        errors.push(issue('INVALID_RANGE', `/data/${index}/binEnd`, '分箱宽度必须大于 0'));
      }
      if (i && row.binStart < points[i - 1].row.binEnd) {
        errors.push(issue('INVALID_ORDER', `/data/${index}/binStart`, '分箱必须依次排列，不能重叠'));
      }
      if (spec.statistic !== 'density' && Math.abs(row.binEnd - row.binStart - width) > 1e-10 * Math.max(1, width)) {
        errors.push(issue('UNSUPPORTED_COMBINATION', '/statistic', '不等宽分箱请显式使用 density，以面积表示比例'));
      }
    });
  }
  return errors;
}
