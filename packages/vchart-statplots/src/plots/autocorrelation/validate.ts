import type { AutocorrelationPlotSpec } from './types';
import { checkSeries, issue } from '../../common/validation';
import { checkBounds, checkAscending } from '../../common/bounds';
export function validateAutocorrelation(spec: AutocorrelationPlotSpec) {
  const errors = [
    ...checkSeries(spec.data),
    ...checkBounds(spec.data, spec.interval),
    ...checkAscending(spec.data, 'lag')
  ];
  spec.data.forEach((row, i) => {
    if (!Number.isInteger(row.lag) || row.lag < 0) {
      errors.push(issue('INVALID_RANGE', `/data/${i}/lag`, 'lag 须为非负整数'));
    }
  });
  return errors;
}
