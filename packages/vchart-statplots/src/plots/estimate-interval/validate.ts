import { validateSampleEstimateOptions } from '../../common/sample-estimate';
import type { PointIntervalPlotSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { validateInterval } from '../../common/interval';
import { checkSeries, checkUnique, issue } from '../../common/validation';
export function validateEstimateInterval(spec: PointIntervalPlotSpec): StatPlotIssue[] {
  const errors = checkSeries(spec.data);
  if (spec.input === 'estimates') {
    errors.push(
      ...validateInterval(spec.interval, '/interval'),
      ...checkUnique(spec.data, row => JSON.stringify([row.category, row.series]))
    );
    spec.data.forEach((row, i) => {
      if (row.lower > row.upper) {
        errors.push(issue('INVALID_RANGE', `/data/${i}/lower`, '区间下界不能超过上界'));
      }
      if (spec.valueScale === 'log' && [row.lower, row.upper, row.estimate].some(value => value <= 0)) {
        errors.push(issue('UNSUPPORTED_COMBINATION', `/data/${i}`, 'log 轴的估计值和区间须为正'));
      }
    });
  } else {
    errors.push(...validateSampleEstimateOptions(spec));
  }
  spec.data.forEach((row, i) => {
    if (!row.category.length) {
      errors.push(issue('INVALID_RANGE', `/data/${i}/category`, '分类不能为空'));
    }
  });
  if (spec.valueScale === 'log' && spec.referenceLine && spec.referenceLine.value <= 0) {
    errors.push(issue('UNSUPPORTED_COMBINATION', '/referenceLine/value', 'log 轴参考值须为正'));
  }
  return errors;
}
