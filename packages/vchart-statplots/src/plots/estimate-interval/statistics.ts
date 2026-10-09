import { mean, variance, quantileSorted, bootstrapEstimate } from '@visactor/vutils';
import type { PointIntervalPlotSpec } from './types';
import type { SeriesRow } from '../../common/types';
import { intervalLabel } from '../../common/interval';
import { issue } from '../../common/validation';
import { StatPlotValidationError } from '../../errors';
export interface PointIntervalSummary extends SeriesRow {
  category: string;
  estimate: number;
  lower: number | null;
  upper: number | null;
  interval: string;
  sampleCount?: number;
}
export function summarizePointIntervals(spec: PointIntervalPlotSpec): PointIntervalSummary[] {
  if (spec.input === 'estimates') {
    return spec.data.map(row => ({ ...row, interval: intervalLabel(spec.interval) }));
  }
  const groups = new Map<string, { category: string; series?: string; values: number[] }>();
  for (const row of spec.data) {
    const key = JSON.stringify([row.category, row.series]);
    let group = groups.get(key);
    if (!group) {
      group = { category: row.category, series: row.series, values: [] };
      groups.set(key, group);
    }
    group.values.push(row.value);
  }
  const bar = spec.errorBar ?? { kind: 'confidence' as const };
  return Array.from(groups.values(), group => {
    const values = group.values.sort((a, b) => a - b);
    const estimator = (sample: readonly number[]) => {
      const value =
        spec.estimator === 'median'
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
    const estimate = spec.estimator === 'median' ? quantileSorted(values, 0.5)! : mean(values)!;
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
      throw new StatPlotValidationError([
        issue('INVALID_RANGE', '/data', '估计值或区间无法用有限数值表示，请转换单位')
      ]);
    }
    if (spec.valueScale === 'log' && (estimate <= 0 || (lower !== null && lower <= 0))) {
      throw new StatPlotValidationError([
        issue('UNSUPPORTED_COMBINATION', '/valueScale', 'log 轴的估计值和区间端点须为正')
      ]);
    }
    return {
      category: group.category,
      series: group.series,
      estimate,
      lower,
      upper,
      interval,
      sampleCount: values.length
    };
  });
}
