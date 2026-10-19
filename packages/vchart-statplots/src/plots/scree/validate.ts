import type { ScreePlotSpec } from './types';
import { checkUnique, checkRange, issue } from '../../common/validation';
export function validateScree(spec: ScreePlotSpec) {
  const errors = checkUnique(spec.data, row => String(row.component));
  let sum = 0;
  spec.data.forEach((row, i) => {
    errors.push(...checkRange(row.explainedVarianceRatio, `/data/${i}/explainedVarianceRatio`, 0, 1));
    if (!Number.isInteger(row.component) || row.component <= 0 || (i && row.component <= spec.data[i - 1].component)) {
      errors.push(issue('INVALID_ORDER', `/data/${i}/component`, 'component 须为严格递增的正整数'));
    }
    sum += row.explainedVarianceRatio;
  });
  if (sum > 1 + 1e-10) {
    errors.push(issue('INVALID_RANGE', '/data', '解释率之和不能超过 1'));
  }
  return errors;
}
