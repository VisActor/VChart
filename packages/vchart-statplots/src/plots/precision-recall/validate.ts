import type { PrecisionRecallCurveSpec } from './types';
import { validateBinaryScores } from '../../common/binary-classification';
export function validatePrecisionRecall(spec: PrecisionRecallCurveSpec) {
  return validateBinaryScores(spec.data, false);
}
