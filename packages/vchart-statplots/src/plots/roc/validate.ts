import type { RocCurveSpec } from './types';
import { validateBinaryScores } from '../../common/binary-classification';
export function validateRoc(spec: RocCurveSpec) {
  return validateBinaryScores(spec.data, true);
}
