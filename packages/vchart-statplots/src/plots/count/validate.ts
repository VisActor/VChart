import type { CountPlotSpec } from './types';
import { checkSeries, checkUnique, checkCount } from '../../common/validation';
export function validateCount(spec: CountPlotSpec) {
  const errors = [
    ...checkSeries(spec.data),
    ...checkUnique(spec.data, row => JSON.stringify([row.category, row.series]))
  ];
  spec.data.forEach((row, i) => errors.push(...checkCount(row.count, `/data/${i}/count`)));
  return errors;
}
