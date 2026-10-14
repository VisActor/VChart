import type { PairedComparisonPlotSpec } from './types';
import { checkSeries, checkUnique, issue } from '../../common/validation';
export function validatePaired(spec: PairedComparisonPlotSpec) {
  const errors = [...checkSeries(spec.data), ...checkUnique(spec.data, row => JSON.stringify([row.id, row.category]))];
  if (spec.categoryOrder[0] === spec.categoryOrder[1]) {
    errors.push(issue('DUPLICATE_KEY', '/categoryOrder', '两个状态须不同'));
  }
  const groups = new Map<string, string | undefined>();
  spec.data.forEach((row, i) => {
    if (!spec.categoryOrder.includes(row.category)) {
      errors.push(issue('INVALID_RANGE', `/data/${i}/category`, 'category 须来自 categoryOrder'));
    }
    if (groups.has(row.id) && groups.get(row.id) !== row.series) {
      errors.push(issue('INCONSISTENT_SERIES', `/data/${i}/series`, '同一 id 的系列必须一致'));
    }
    groups.set(row.id, row.series);
  });
  return errors;
}
