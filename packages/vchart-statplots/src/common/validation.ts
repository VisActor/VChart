import type { SeriesRow, StatPlotIssue } from './types';

export const issue = (code: StatPlotIssue['code'], path: string, message: string): StatPlotIssue => ({
  code,
  path,
  message
});

export function checkRange(value: number, path: string, min: number, max: number): StatPlotIssue[] {
  return value >= min && value <= max ? [] : [issue('INVALID_RANGE', path, `值必须位于 [${min}, ${max}]`)];
}

/** 校验发生在编译边界；分组索引不进入图元热路径。 */
export function seriesGroups<T extends SeriesRow>(
  rows: readonly T[]
): Map<string | undefined, { row: T; index: number }[]> {
  const groups = new Map<string | undefined, { row: T; index: number }[]>();
  rows.forEach((row, index) => {
    const group = groups.get(row.series);
    if (group) {
      group.push({ row, index });
    } else {
      groups.set(row.series, [{ row, index }]);
    }
  });
  return groups;
}

export function checkSeries(rows: readonly SeriesRow[], path = '/data'): StatPlotIssue[] {
  const grouped = rows.some(row => row.series !== undefined);
  return grouped
    ? rows.flatMap((row, i) =>
        row.series === undefined || row.series.length === 0
          ? [issue('INCONSISTENT_SERIES', `${path}/${i}/series`, '分组数据的每行均须有非空 series')]
          : []
      )
    : [];
}

export function checkCount(value: number, path: string): StatPlotIssue[] {
  return Number.isInteger(value) && value >= 0 ? [] : [issue('INVALID_RANGE', path, 'count 必须为非负整数')];
}

export function checkUnique<T>(rows: readonly T[], key: (row: T) => string, path = '/data'): StatPlotIssue[] {
  const seen = new Set<string>();
  const errors: StatPlotIssue[] = [];
  rows.forEach((row, i) => {
    const value = key(row);
    if (seen.has(value)) {
      errors.push(issue('DUPLICATE_KEY', `${path}/${i}`, '同一标识出现重复记录'));
    }
    seen.add(value);
  });
  return errors;
}
