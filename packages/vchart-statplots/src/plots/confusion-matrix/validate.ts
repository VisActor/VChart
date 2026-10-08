import type { ConfusionMatrixSpec } from './types';
import { checkUnique, checkCount, issue } from '../../common/validation';
export function validateConfusionMatrix(spec: ConfusionMatrixSpec) {
  const errors = checkUnique(spec.data, row => JSON.stringify([row.actual, row.predicted]));
  const classes = new Set(spec.data.flatMap(row => [row.actual, row.predicted]));
  if (spec.data.length !== classes.size * classes.size) {
    errors.push(issue('INVALID_RANGE', '/data', '混淆矩阵须显式提供所有类别组合，包括 count=0'));
  }
  spec.data.forEach((row, i) => errors.push(...checkCount(row.count, `/data/${i}/count`)));
  return errors;
}
