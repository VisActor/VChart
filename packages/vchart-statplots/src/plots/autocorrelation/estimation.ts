import { normalQuantile } from '@visactor/vutils';
import type { AutocorrelationPlotSpec } from './types';
import type { StatPlotIssue } from '../../common/types';
import { seriesGroups, issue } from '../../common/validation';
import { StatPlotValidationError } from '../../errors';

export interface AutocorrelationResultRow {
  lag: number;
  correlation: number;
  series?: string;
  sampleCount: number;
  method: 'acf' | 'pacf';
  lower?: number;
  upper?: number;
  confidenceLevel?: number;
}

export function prepareAutocorrelation(spec: AutocorrelationPlotSpec) {
  const method = spec.method ?? 'acf';
  const level = spec.confidence === false ? undefined : spec.confidence?.level ?? 0.95;
  const errors: StatPlotIssue[] = [];
  if (level !== undefined && (!(level > 0 && level < 1) || !((1 + level) / 2 < 1))) {
    errors.push(issue('INVALID_RANGE', '/confidence/level', '置信水平须在 (0,1) 内且对应分位点可表示'));
  }
  if (spec.maxLag !== undefined && (!Number.isInteger(spec.maxLag) || spec.maxLag < 1 || spec.maxLag > 512)) {
    errors.push(issue('INVALID_RANGE', '/maxLag', '最大滞后须为 1–512 的整数'));
  }
  const groups = [];
  for (const [series, indexed] of seriesGroups(spec.data)) {
    const n = indexed.length;
    const limit = method === 'pacf' ? Math.floor(n / 2) - 1 : n - 1;
    const maxLag = spec.maxLag ?? Math.min(Math.floor(10 * Math.log10(n)), limit, 512);
    if (n < (method === 'pacf' ? 4 : 2) || maxLag > limit) {
      errors.push(
        issue(
          'INVALID_RANGE',
          spec.maxLag !== undefined ? '/maxLag' : `/data/${indexed[0].index}`,
          '样本量不足以计算所请求的滞后'
        )
      );
    }
    let mean = 0;
    for (let i = 0; i < n; i++) mean += (indexed[i].row.value - mean) / (i + 1);
    let scale = 0;
    for (const { row } of indexed) scale = Math.max(scale, Math.abs(row.value - mean));
    if (!(scale > 0) || !Number.isFinite(mean) || !Number.isFinite(scale)) {
      errors.push(
        issue(
          'INVALID_RANGE',
          `/data/${indexed[0].index}/value`,
          '常数序列或中心化范围不可表示，请提供非恒定序列或转换单位'
        )
      );
    }
    groups.push({ series, indexed, mean, scale, maxLag });
  }
  return { groups, errors, method, level };
}

export function computeAutocorrelation(spec: AutocorrelationPlotSpec): AutocorrelationResultRow[] {
  const prepared = prepareAutocorrelation(spec);
  if (prepared.errors.length) throw new StatPlotValidationError(prepared.errors);
  const result: AutocorrelationResultRow[] = [];
  const z = prepared.level === undefined ? undefined : normalQuantile((1 + prepared.level) / 2);
  for (const group of prepared.groups) {
    const n = group.indexed.length;
    const centered = group.indexed.map(({ row }) => (row.value - group.mean) / group.scale);
    const gamma: number[] = [];
    for (let k = 0; k <= group.maxLag; k++) {
      let sum = 0;
      for (let i = 0; i < n - k; i++) sum += centered[i] * centered[i + k];
      gamma.push(sum / n);
    }
    const acf = gamma.map(value => value / gamma[0]);
    const correlations = [1];
    if (prepared.method === 'pacf') {
      let previous: number[] = [];
      let variance = gamma[0];
      for (let k = 1; k <= group.maxLag; k++) {
        let sum = 0;
        for (let j = 1; j < k; j++) sum += previous[j - 1] * gamma[k - j];
        const reflection = (gamma[k] - sum) / variance;
        const current = Array.from({ length: k }, (_, j) =>
          j === k - 1 ? reflection : previous[j] - reflection * previous[k - 2 - j]
        );
        variance *= 1 - reflection * reflection;
        if (!(variance > 0) || !Number.isFinite(reflection)) {
          throw new StatPlotValidationError([
            issue('INVALID_RANGE', `/data/${group.indexed[0].index}/value`, 'PACF 递推方差不可用，请调整序列或滞后阶数')
          ]);
        }
        correlations.push(reflection);
        previous = current;
      }
    } else correlations.push(...acf.slice(1));
    let squared = 0;
    correlations.forEach((correlation, lag) => {
      const row: AutocorrelationResultRow = {
        lag,
        correlation,
        series: group.series,
        sampleCount: n,
        method: prepared.method
      };
      if (z !== undefined && lag > 0) {
        const width = z * Math.sqrt((prepared.method === 'acf' ? 1 + 2 * squared : 1) / n);
        row.lower = -width;
        row.upper = width;
        row.confidenceLevel = prepared.level;
      }
      result.push(row);
      if (lag > 0) squared += acf[lag] * acf[lag];
    });
  }
  return result;
}
