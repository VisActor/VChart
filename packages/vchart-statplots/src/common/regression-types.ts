import type { SeriesRow } from './types';

/** 原始配对观测；重复 x/y 保留，不接收统计结果。 */
export interface RegressionObservation extends SeriesRow {
  x: number;
  y: number;
  id?: string;
}
export interface LinearRegressionOptions {
  method: 'linear';
}
export interface PolynomialRegressionOptions {
  method: 'polynomial';
  degree: number;
}
export interface LowessRegressionOptions {
  method: 'lowess';
  span?: number;
  iterations?: number;
  /** 与 x 同单位；0 精确求值，正值显式插值加速，全量观测仍参与。 */
  delta?: number;
}
export type RegressionOptions = LinearRegressionOptions | PolynomialRegressionOptions | LowessRegressionOptions;
/** 均值响应的逐点 percentile bootstrap CI，不是预测区间。 */
export type RegressionConfidence =
  | false
  | {
      kind: 'confidence';
      level?: number;
      resamples?: number;
      seed?: number;
    };
