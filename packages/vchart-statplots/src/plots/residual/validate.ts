import type { ResidualPlotSpec } from './types';
import { checkSeries, checkUnique } from '../../common/validation';
export function validateResidual(spec: ResidualPlotSpec) {
  return [...checkSeries(spec.data), ...checkUnique(spec.data, row => row.id)];
}
