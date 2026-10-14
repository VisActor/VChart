import type { CorrelationMatrixSpec } from './types';
import { validateObservationTable } from '../../common/observation-table';
import { issue } from '../../common/validation';
export function validateCorrelationMatrix(spec: CorrelationMatrixSpec) {
  const errors = validateObservationTable(spec.variables, spec.data.observations);
  if (spec.minSamples !== undefined && (!Number.isInteger(spec.minSamples) || spec.minSamples < 2)) {
    errors.push(issue('INVALID_RANGE', '/minSamples', '最少有效配对数须为至少 2 的整数'));
  }
  return errors;
}
