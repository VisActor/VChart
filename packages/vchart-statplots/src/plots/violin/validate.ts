import type { ViolinPlotSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { checkSeries } from '../../common/validation';
import { prepareViolin } from './estimation';

export function validateViolin(spec: ViolinPlotSpec): StatPlotIssue[] {
  return [...checkSeries(spec.data), ...prepareViolin(spec).errors];
}
