import type { BaseSpec, SeriesRow, Interval } from '../../common/types';
import type {
  LinearRegressionOptions,
  PolynomialRegressionOptions,
  LowessRegressionOptions,
  RegressionConfidence
} from '../../common/regression-types';
/** 原始逐条观测；可选内部拟合或外部估计。 */
export interface ScatterPlotRow extends SeriesRow {
  x: number;
  y: number;
  id?: string;
}
export interface FitRow extends SeriesRow {
  x: number;
  estimate: number;
  lower?: number;
  upper?: number;
}
export type ScatterObservationsFit =
  | ((LinearRegressionOptions | PolynomialRegressionOptions) & {
      input: 'observations';
      confidence?: RegressionConfidence;
      sampling?: { points?: number };
    })
  | (LowessRegressionOptions & { input: 'observations'; confidence?: false });
export interface ScatterEstimatesFit {
  input: 'estimates';
  method: string;
  data: FitRow[];
  interval?: Interval;
}
export interface ScatterPlotSpec extends BaseSpec {
  type: 'scatterPlot';
  data: ScatterPlotRow[];
  fit?: ScatterObservationsFit | ScatterEstimatesFit;
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { x?: string; y?: string };
}
