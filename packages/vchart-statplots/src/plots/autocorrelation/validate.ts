import type { AutocorrelationPlotSpec } from './types';
import { checkSeries } from '../../common/validation';
import { prepareAutocorrelation } from './estimation';
export function validateAutocorrelation(spec: AutocorrelationPlotSpec) {
  return [...checkSeries(spec.data), ...prepareAutocorrelation(spec).errors];
}
