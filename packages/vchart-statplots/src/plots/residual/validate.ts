import type { ResidualPlotSpec } from './types';
import { checkSeries, checkUnique, issue } from '../../common/validation';
export function validateResidual(spec: ResidualPlotSpec) {
  const errors = [
    ...checkSeries(spec.data),
    ...checkUnique<{ id: string; series?: string }>(spec.data, row => JSON.stringify([row.id, row.series]))
  ];
  spec.data.forEach((row, i) => {
    if (!row.id.length) {
      errors.push(issue('INVALID_RANGE', `/data/${i}/id`, 'id 不能为空'));
    }
  });
  return errors;
}
