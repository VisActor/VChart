import type { CountPlotSpec } from './types';
import { checkSeries, issue } from '../../common/validation';
export function validateCount(spec: CountPlotSpec) {
  const errors = checkSeries(spec.data);
  if (spec.normalizationScope !== undefined && spec.statistic !== 'proportion') {
    errors.push(issue('UNSUPPORTED_COMBINATION', '/normalizationScope', '仅 proportion 模式可配置比例分母'));
  }
  return errors;
}
