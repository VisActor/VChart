import type { MissingValueMatrixSpec } from './types';
import { validateObservationTable } from '../../common/observation-table';
export function validateMissingness(spec: MissingValueMatrixSpec) {
  return validateObservationTable(spec.variables, spec.data.observations);
}
