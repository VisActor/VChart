import type { SeasonalPlotSpec } from './types';
import { checkSeries, checkUnique, issue } from '../../common/validation';
export function validateSeasonal(spec: SeasonalPlotSpec) {
  const errors = [
    ...checkSeries(spec.data),
    ...checkUnique(spec.data, row => JSON.stringify([row.series, row.cycle, row.phase]))
  ];
  for (const field of ['cycle', 'phase'] as const) {
    const orderKey = field === 'cycle' ? 'cycleOrder' : 'phaseOrder';
    const order = new Set(spec[orderKey]);
    if (!order.size || order.size !== spec[orderKey].length) {
      errors.push(issue('INVALID_ORDER', `/${orderKey}`, '须提供非空、不重复的顺序'));
    }
    spec.data.forEach((row, i) => {
      if (!order.has(row[field])) {
        errors.push(issue('INVALID_RANGE', `/data/${i}/${field}`, `${field} 不在 ${orderKey} 中`));
      }
    });
  }
  return errors;
}
