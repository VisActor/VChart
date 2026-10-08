import type { ViolinPlotRow, ViolinPlotSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { checkSeries, issue } from '../../common/validation';

export function violinGroups(rows: readonly ViolinPlotRow[]): Map<string, { row: ViolinPlotRow; index: number }[]> {
  const groups = new Map<string, { row: ViolinPlotRow; index: number }[]>();
  rows.forEach((row, index) => {
    const key = JSON.stringify([row.category, row.series]);
    const group = groups.get(key);
    if (group) {
      group.push({ row, index });
    } else {
      groups.set(key, [{ row, index }]);
    }
  });
  return groups;
}

export function validateViolin(spec: ViolinPlotSpec): StatPlotIssue[] {
  const errors = checkSeries(spec.data);
  for (const points of violinGroups(spec.data).values()) {
    let area = 0;
    points.forEach(({ row, index }, i) => {
      if (row.density < 0) {
        errors.push(issue('INVALID_RANGE', `/data/${index}/density`, '密度不能为负数'));
      }
      if (i) {
        const previous = points[i - 1].row;
        if (row.value <= previous.value) {
          errors.push(issue('INVALID_ORDER', `/data/${index}/value`, '每组密度采样位置必须严格递增'));
        }
        area += ((row.value - previous.value) * (row.density + previous.density)) / 2;
      }
    });
    if (points.length < 2 || area <= 0) {
      errors.push(issue('INVALID_RANGE', `/data/${points[0].index}`, '每组至少两个采样点，密度曲线面积必须大于 0'));
    }
  }
  return errors;
}
