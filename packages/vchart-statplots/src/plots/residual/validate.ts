import type { ResidualPlotSpec } from './types';
import { checkSeries, checkUnique, issue } from '../../common/validation';
import { checkRegressionOptions, checkRegressionObservations } from '../../common/regression';
export function validateResidual(spec: ResidualPlotSpec) {
  const errors = [
    ...checkSeries(spec.data),
    ...checkUnique<{ id?: string; series?: string }>(spec.data, row =>
      row.id === undefined ? undefined : JSON.stringify([row.id, row.series])
    )
  ];
  spec.data.forEach((row, i) => {
    if (row.id !== undefined && !row.id.length) {
      errors.push(issue('INVALID_RANGE', `/data/${i}/id`, 'id 不能为空'));
    }
  });
  if (spec.input === 'observations') {
    const options = spec.regression ?? { method: 'linear' as const };
    errors.push(...checkRegressionOptions(options, '/regression'), ...checkRegressionObservations(spec.data, options));
  }
  if (spec.smooth) {
    errors.push(...checkRegressionOptions(spec.smooth, '/smooth'));
  }
  return errors;
}
