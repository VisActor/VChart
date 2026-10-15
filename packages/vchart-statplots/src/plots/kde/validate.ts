import type { KdePlotSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { checkSeries } from '../../common/validation';
import { prepareKde } from './estimation';
export function validateKde(spec: KdePlotSpec): StatPlotIssue[] {
  return [...checkSeries(spec.data), ...prepareKde(spec).errors];
}
