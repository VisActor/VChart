import type { EcdfPlotSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { checkSeries, issue } from '../../common/validation';
import { ecdfDomain } from './distribution';
export function validateEcdf(spec: EcdfPlotSpec): StatPlotIssue[] {
  const errors = checkSeries(spec.data);
  if (!ecdfDomain(spec.data)) {
    errors.push(issue('INVALID_RANGE', '/data', 'ECDF 轴域和留白无法用有限数值表示，请先转换单位或平移数值'));
  }
  return errors;
}
