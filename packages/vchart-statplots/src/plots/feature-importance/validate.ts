import type { FeatureImportancePlotSpec } from './types';
import { checkSeries, checkUnique } from '../../common/validation';
import { checkBounds } from '../../common/bounds';
export function validateFeatureImportance(spec: FeatureImportancePlotSpec) {
  return [
    ...checkSeries(spec.data),
    ...checkBounds(spec.data, spec.interval),
    ...checkUnique(spec.data, row => JSON.stringify([row.feature, row.series]))
  ];
}
