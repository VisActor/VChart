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
    const bar = spec.errorBar;
    if (bar && 'level' in bar && bar.level !== undefined && !(bar.level > 0 && bar.level < 1)) {
      errors.push(issue('INVALID_RANGE', '/errorBar/level', '区间水平须位于 0–1 之间'));
    }
    if (bar && 'multiplier' in bar && bar.multiplier !== undefined && bar.multiplier <= 0) {
      errors.push(issue('INVALID_RANGE', '/errorBar/multiplier', '区间倍数须为正'));
    }
    if (bar && bar.kind === 'confidence') {
      if (
        bar.resamples !== undefined &&
        (!Number.isInteger(bar.resamples) || bar.resamples < 100 || bar.resamples > 10000)
      ) {
        errors.push(issue('INVALID_RANGE', '/errorBar/resamples', '重采样次数须为 100–10000 整数'));
      }
      if (bar.seed !== undefined && (!Number.isInteger(bar.seed) || bar.seed < 0 || bar.seed > 0xffffffff)) {
        errors.push(issue('INVALID_RANGE', '/errorBar/seed', '种子须为 uint32 整数'));
      }
    }
    if (bar && bar.kind === 'standardError' && spec.estimator === 'median') {
      errors.push(issue('UNSUPPORTED_COMBINATION', '/errorBar/kind', '标准误只支持均值估计'));
    }
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
