import type { PointIntervalPlotSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { validateInterval } from '../../common/interval';
import { checkSeries, checkUnique, issue } from '../../common/validation';
export function validateEstimateInterval(spec: PointIntervalPlotSpec): StatPlotIssue[] {
  const errors = [
    ...checkSeries(spec.data),
    ...validateInterval(spec.interval, '/interval'),
    ...checkUnique(spec.data, row => JSON.stringify([row.category, row.series]))
  ];
  spec.data.forEach((row, i) => {
    if (row.lower > row.upper) {
      errors.push(issue('INVALID_RANGE', `/data/${i}/lower`, '区间下界不能超过上界'));
    }
    if (spec.valueScale === 'log' && [row.lower, row.upper, row.estimate].some(value => value <= 0)) {
      errors.push(issue('UNSUPPORTED_COMBINATION', `/data/${i}`, 'log 轴上的估计值和上下界必须大于 0'));
    }
  });
  if (spec.valueScale === 'log' && spec.referenceLine && spec.referenceLine.value <= 0) {
    errors.push(issue('UNSUPPORTED_COMBINATION', '/referenceLine/value', 'log 轴参考值必须大于 0'));
  }
  return errors;
}
