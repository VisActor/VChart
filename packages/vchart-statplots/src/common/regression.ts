import { regressionLinear, regressionPolynomial, regressionLowess, regressionBootstrap } from '@visactor/vutils';
import { StatPlotValidationError } from '../errors';
import { seriesGroups, issue } from './validation';
import type { StatPlotIssue, SeriesRow } from './types';
import type {
  RegressionObservation,
  RegressionOptions,
  RegressionConfidence,
  LowessRegressionOptions
} from './regression-types';

export function checkRegressionOptions(options: RegressionOptions, path: string): StatPlotIssue[] {
  const errors: StatPlotIssue[] = [];
  if (
    options.method === 'polynomial' &&
    (!Number.isInteger(options.degree) || options.degree < 2 || options.degree > 5)
  ) {
    errors.push(issue('INVALID_RANGE', `${path}/degree`, '多项式次数须为 2–5 整数'));
  }
  if (options.method === 'lowess') {
    if (options.span !== undefined && !(options.span > 0 && options.span <= 1)) {
      errors.push(issue('INVALID_RANGE', `${path}/span`, 'LOWESS span 须在 (0,1]'));
    }
    if (
      options.iterations !== undefined &&
      (!Number.isInteger(options.iterations) || options.iterations < 0 || options.iterations > 10)
    ) {
      errors.push(issue('INVALID_RANGE', `${path}/iterations`, 'LOWESS iterations 须为 0–10 整数'));
    }
    if (options.delta !== undefined && options.delta < 0) {
      errors.push(issue('INVALID_RANGE', `${path}/delta`, 'LOWESS delta 须为非负数'));
    }
  }
  return errors;
}

export function checkRegressionConfidence(confidence: RegressionConfidence | undefined, path: string): StatPlotIssue[] {
  if (!confidence) {
    return [];
  }
  const errors: StatPlotIssue[] = [];
  if (confidence.level !== undefined && !(confidence.level > 0 && confidence.level < 1)) {
    errors.push(issue('INVALID_RANGE', `${path}/level`, '置信水平须在 (0,1)'));
  }
  if (
    confidence.resamples !== undefined &&
    (!Number.isInteger(confidence.resamples) || confidence.resamples < 100 || confidence.resamples > 10000)
  ) {
    errors.push(issue('INVALID_RANGE', `${path}/resamples`, '重采样次数须为 100–10000 整数'));
  }
  if (
    confidence.seed !== undefined &&
    (!Number.isInteger(confidence.seed) || confidence.seed < 0 || confidence.seed > 0xffffffff)
  ) {
    errors.push(issue('INVALID_RANGE', `${path}/seed`, '种子须为 uint32 整数'));
  }
  return errors;
}

/** 验证阶段仅统计必要的不同 x，不进行完整拟合或 bootstrap。 */
export function checkRegressionObservations(
  data: readonly RegressionObservation[],
  options: RegressionOptions
): StatPlotIssue[] {
  const required = options.method === 'polynomial' ? options.degree + 1 : 2;
  const groups = new Map<string | undefined, { count: number; distinct: Set<number>; index: number }>();
  data.forEach((row, index) => {
    let group = groups.get(row.series);
    if (!group) {
      group = { count: 0, distinct: new Set(), index };
      groups.set(row.series, group);
    }
    group.count++;
    if (group.distinct.size < required) {
      group.distinct.add(row.x);
    }
  });
  const errors: StatPlotIssue[] = [];
  for (const group of groups.values()) {
    if (group.count < required || group.distinct.size < required) {
      errors.push(issue('INVALID_RANGE', `/data/${group.index}`, `该系列拟合至少需要 ${required} 个不同 x 的观测`));
    }
  }
  return errors;
}

export function regressionMethodLabel(options: RegressionOptions): string {
  if (options.method === 'linear') {
    return '线性回归';
  }
  if (options.method === 'polynomial') {
    return `${options.degree} 次多项式回归`;
  }
  return `LOWESS · span=${options.span ?? 2 / 3} · iterations=${options.iterations ?? 3} · delta=${options.delta ?? 0}`;
}

function regressionError(index: number, message: string): never {
  throw new StatPlotValidationError([issue('INVALID_RANGE', `/data/${index}`, message)]);
}
export function finiteRegressionValue(value: number, index: number, field: string): number {
  if (!Number.isFinite(value)) {
    throw new StatPlotValidationError([
      issue('INVALID_RANGE', `/data/${index}/${field}`, '回归结果无法用有限数值表示')
    ]);
  }
  return value;
}

/** 只在编译边界构建模型；上游的 predict 与曲线复用固定状态。 */
function fitModel(data: RegressionObservation[], options: RegressionOptions, index: number) {
  try {
    if (options.method === 'lowess') {
      const model = regressionLowess(data, undefined, undefined, {
        span: options.span ?? 2 / 3,
        iterations: options.iterations ?? 3,
        delta: options.delta ?? 0
      });
      return { predict: (x: number) => model.predict(x) as number, nodes: model.fitted, grid: model.evaluateGrid };
    }
    const model =
      options.method === 'linear'
        ? regressionLinear(data)
        : regressionPolynomial(data, undefined, undefined, { degree: options.degree });
    const rank = options.method === 'linear' ? 2 : options.degree + 1;
    if (model.rank < rank) {
      regressionError(index, '回归设计矩阵不满秩，无法识别该模型');
    }
    return { predict: model.predict, nodes: undefined, grid: model.evaluateGrid };
  } catch (error) {
    if (error instanceof StatPlotValidationError) {
      throw error;
    }
    if (error instanceof RangeError) {
      regressionError(index, error.message);
    }
    throw error;
  }
}

export interface RegressionCurveRow extends SeriesRow {
  x: number;
  estimate: number;
  lower?: number;
  upper?: number;
  method: string;
  interval?: string;
  sampleCount: number;
}

export function buildRegressionCurves(
  data: RegressionObservation[],
  options: RegressionOptions,
  confidence?: RegressionConfidence,
  points = 100,
  source?: { indices: readonly number[]; valueField: 'y' | 'residual' }
): RegressionCurveRow[] {
  const result: RegressionCurveRow[] = [];
  for (const [series, entries] of seriesGroups(data)) {
    const rows = entries.map(entry => entry.row),
      index = source?.indices[entries[0].index] ?? entries[0].index;
    const model = fitModel(rows, options, index);
    const nodes = model.nodes ?? model.grid(points);
    const unique = nodes.filter((node, i) => i === 0 || node.x !== nodes[i - 1].x);
    let bounds: { lower: number; upper: number }[] | undefined;
    let interval: string | undefined;
    if (options.method !== 'lowess' && confidence !== false) {
      const degree = options.method === 'linear' ? 1 : options.degree;
      if (rows.length <= degree + 1) {
        interval = '置信带不可计算：样本不足';
      } else {
        const config = confidence || { kind: 'confidence' as const };
        const level = config.level ?? 0.95;
        interval = `${level * 100}% 均值响应置信带（成对 bootstrap）`;
        try {
          bounds = regressionBootstrap(rows, {
            method: options.method,
            degree,
            grid: unique.map(p => p.x),
            level,
            resamples: config.resamples ?? 1000,
            seed: config.seed ?? 0
          });
        } catch (error) {
          if (error instanceof RangeError) {
            regressionError(index, error.message);
          }
          throw error;
        }
      }
    }
    unique.forEach((node, i) => {
      result.push({
        x: node.x,
        estimate: finiteRegressionValue(node.y, index, source?.valueField ?? 'y'),
        series,
        method: regressionMethodLabel(options),
        interval,
        sampleCount: rows.length,
        ...(bounds
          ? {
              lower: finiteRegressionValue(bounds[i].lower, index, source?.valueField ?? 'y'),
              upper: finiteRegressionValue(bounds[i].upper, index, source?.valueField ?? 'y')
            }
          : {})
      });
    });
  }
  return result;
}

export function buildRegressionPredictions(data: RegressionObservation[], options: RegressionOptions) {
  const result = new Array<RegressionObservation & { fittedValue: number; residual: number; method: string }>(
    data.length
  );
  for (const entries of seriesGroups(data).values()) {
    const model = fitModel(
      entries.map(entry => entry.row),
      options,
      entries[0].index
    );
    const method = regressionMethodLabel(options);
    for (const { row, index } of entries) {
      const fittedValue = finiteRegressionValue(model.predict(row.x), index, 'y');
      result[index] = { ...row, fittedValue, residual: finiteRegressionValue(row.y - fittedValue, index, 'y'), method };
    }
  }
  return result;
}

export function buildResidualSmooth<T extends SeriesRow>(
  data: T[],
  x: (row: T) => number,
  y: (row: T) => number,
  options: LowessRegressionOptions
) {
  const observations: RegressionObservation[] = [];
  const sourceIndices: number[] = [];
  for (const [series, entries] of seriesGroups(data)) {
    if (new Set(entries.map(entry => x(entry.row))).size < 2) {
      continue;
    }
    entries.forEach(({ row, index }) => {
      observations.push({ x: x(row), y: y(row), series });
      sourceIndices.push(index);
    });
  }
  return buildRegressionCurves(observations, options, false, 100, { indices: sourceIndices, valueField: 'residual' });
}
