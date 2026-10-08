import type { StripPlotSpec } from './types';
import { checkSeries, checkUnique, checkRange, issue } from '../../common/validation';
export function validateStripPlot(spec: StripPlotSpec) {
  const errors = [...checkSeries(spec.data), ...checkUnique(spec.data, row => row.id)];
  if (spec.jitterRatio !== undefined) {
    errors.push(...checkRange(spec.jitterRatio, '/jitterRatio', 0, 0.5));
    if (spec.layout !== 'jitter') {
      errors.push(issue('UNSUPPORTED_COMBINATION', '/jitterRatio', 'jitter 仅用于 jitter 布局'));
    }
  }
  return errors;
}
