import type { ConfusionMatrixSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { issue } from '../../common/validation';
export function validateConfusionMatrix(spec: ConfusionMatrixSpec) {
  if (!spec.classOrder) return [];
  const order = new Set(spec.classOrder);
  const errors: StatPlotIssue[] = [];
  if (!order.size || order.size !== spec.classOrder.length) {
    errors.push(issue('INVALID_ORDER', '/classOrder', '类别顺序须非空且没有重复'));
  }
  spec.data.forEach((row, index) => {
    for (const field of ['actual', 'predicted'] as const) {
      if (!order.has(row[field]))
        errors.push(issue('INVALID_RANGE', `/data/${index}/${field}`, '类别不在 classOrder 中'));
    }
  });
  return errors;
}
