import type { Interval, SeriesRow, StatPlotIssue } from './types';
import { issue, seriesGroups } from './validation';
import { validateInterval } from './interval';
export function checkBounds(
  rows: readonly { lower?: number; upper?: number }[],
  interval?: Interval,
  path = '/data'
): StatPlotIssue[] {
  const errors = interval
    ? validateInterval(interval, path === '/data' ? '/interval' : path.replace(/\/data$/, '/interval'))
    : [];
  rows.forEach((row, i) => {
    if ((row.lower === undefined) !== (row.upper === undefined)) {
      errors.push(issue('INVALID_RANGE', `${path}/${i}`, '上下界必须同时提供'));
    }
    if (row.lower !== undefined && row.upper !== undefined && row.lower > row.upper) {
      errors.push(issue('INVALID_RANGE', `${path}/${i}/lower`, '下界不能高于上界'));
    }
    if (row.lower !== undefined && !interval) {
      errors.push(issue('UNSUPPORTED_COMBINATION', '/interval', '提供区间时须声明统计含义'));
    }
  });
  return errors;
}
export function checkAscending<T extends SeriesRow>(
  rows: T[],
  key: keyof T,
  strict = true,
  path = '/data'
): StatPlotIssue[] {
  const errors: StatPlotIssue[] = [];
  seriesGroups(rows).forEach(group =>
    group.forEach(({ row, index }, i) => {
      if (i && (strict ? row[key] <= group[i - 1].row[key] : row[key] < group[i - 1].row[key])) {
        errors.push(
          issue(
            'INVALID_ORDER',
            `${path}/${index}/${String(key)}`,
            strict ? '每个系列内须严格递增' : '每个系列内须单调不减'
          )
        );
      }
    })
  );
  return errors;
}
