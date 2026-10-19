import type { ShapBeeswarmPlotSpec } from './types';
import { checkUnique, issue } from '../../common/validation';
export function validateShapBeeswarm(spec: ShapBeeswarmPlotSpec) {
  const errors = checkUnique(spec.data, row => JSON.stringify([row.id, row.feature]));
  if (new Set(spec.featureOrder).size !== spec.featureOrder.length) {
    errors.push(issue('DUPLICATE_KEY', '/featureOrder', '特征顺序不能重复'));
  }
  spec.data.forEach((row, i) => {
    if (!spec.featureOrder.includes(row.feature)) {
      errors.push(issue('INVALID_RANGE', `/data/${i}/feature`, '特征必须位于 featureOrder'));
    }
  });
  return errors;
}
