import { mean, variance, quantileSorted, bootstrapEstimate } from '@visactor/vutils';
import { intervalLabel } from './interval';
import { issue } from './validation';
import { StatPlotValidationError } from '../errors';
import type { SampleEstimateOptions, SampleEstimate } from './sample-estimate-types';
import type { StatPlotIssue } from './types';

export function summarizeSample(sample: readonly number[], options: SampleEstimateOptions = {}): SampleEstimate {
  if (!sample.length) throw new RangeError('summarizeSample requires a nonempty sample');
  const bar = options.errorBar ?? { kind: 'confidence' as const };
  const values = [...sample].sort((a, b) => a - b);
  const estimator = (sample: readonly number[]) => {
    const value =
      options.estimator === 'median'
        ? quantileSorted(
            [...sample].sort((a, b) => a - b),
            0.5
          )!
        : mean(sample)!;
    if (!Number.isFinite(value)) {
      throw new StatPlotValidationError([
        issue('INVALID_RANGE', '/data', '重采样估计值无法用有限数值表示，请转换单位')
      ]);
    }
    return value;
  };
  const estimate = options.estimator === 'median' ? quantileSorted(values, 0.5)! : mean(values)!;
  let lower: number | null = null;
  let upper: number | null = null;
  let interval = '无区间';
  if (bar !== false) {
    if (values.length === 1 && ['confidence', 'standardError', 'standardDeviation'].includes(bar.kind)) {
      interval = '样本不足，无法计算区间';
    } else if (bar.kind === 'range') {
      lower = values[0];
      upper = values[values.length - 1];
      interval = '样本范围';
    } else if (bar.kind === 'standardError' || bar.kind === 'standardDeviation') {
      const width =
        (Math.sqrt(variance(values)) * (bar.multiplier ?? 1)) /
        (bar.kind === 'standardError' ? Math.sqrt(values.length) : 1);
      lower = estimate - width;
      upper = estimate + width;
      interval = intervalLabel({ kind: bar.kind, multiplier: bar.multiplier ?? 1 });
    } else {
      const level = bar.level ?? 0.95;
      const distribution =
        bar.kind === 'confidence'
          ? bootstrapEstimate(values, estimator, { resamples: bar.resamples ?? 1000, seed: bar.seed ?? 0 }).sort(
              (a, b) => a - b
            )
          : values;
      lower = quantileSorted(distribution, (1 - level) / 2)!;
      upper = quantileSorted(distribution, (1 + level) / 2)!;
      interval = `${level * 100}% ${bar.kind === 'confidence' ? 'bootstrap 置信区间' : '样本百分位区间'}`;
    }
  }
  if (![estimate, ...(lower === null ? [] : [lower, upper!])].every(Number.isFinite)) {
    throw new StatPlotValidationError([issue('INVALID_RANGE', '/data', '估计值或区间无法用有限数值表示，请转换单位')]);
  }
  return { estimate, lower, upper, interval, sampleCount: values.length };
}

export function validateSampleEstimateOptions(options: SampleEstimateOptions): StatPlotIssue[] {
  const errors: StatPlotIssue[] = [];
  const bar = options.errorBar;
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
  if (bar && bar.kind === 'standardError' && options.estimator === 'median') {
    errors.push(issue('UNSUPPORTED_COMBINATION', '/errorBar/kind', '标准误只支持均值估计'));
  }
  return errors;
}
