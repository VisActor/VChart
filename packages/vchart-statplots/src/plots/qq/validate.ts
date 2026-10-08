import type { QqPlotSpec } from './types';
import { checkSeries } from '../../common/validation';
import { checkAscending } from '../../common/bounds';
export function validateQq(spec: QqPlotSpec) {
  return [
    ...checkSeries(spec.data),
    ...checkAscending(spec.data, 'theoreticalQuantile', false),
    ...checkAscending(spec.data, 'sampleQuantile', false)
  ];
}
