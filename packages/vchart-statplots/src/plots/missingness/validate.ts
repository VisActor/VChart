import type { MissingValueMatrixSpec } from './types';
import { checkUnique, issue } from '../../common/validation';
export function validateMissingness(spec: MissingValueMatrixSpec) {
  const errors = checkUnique(spec.data, row => JSON.stringify([row.observationId, row.variable]));
  const observations = new Set(spec.data.map(row => row.observationId));
  const variables = new Set(spec.data.map(row => row.variable));
  if (spec.data.length !== observations.size * variables.size) {
    errors.push(issue('INVALID_RANGE', '/data', '须显式提供所有观测与变量组合，不能将未提供的单元格当成非缺失'));
  }
  return errors;
}
