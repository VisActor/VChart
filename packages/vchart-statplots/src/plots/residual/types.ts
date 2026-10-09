import type { BaseSpec, SeriesRow } from '../../common/types';
import type { RegressionObservation, RegressionOptions, LowessRegressionOptions } from '../../common/regression-types';
export interface ResidualPlotRow extends SeriesRow {
  id: string;
  fittedValue: number;
  residual: number;
}
export interface ResidualPredictionRow extends SeriesRow {
  id: string;
  actual: number;
  fittedValue: number;
}
interface ResidualBase extends BaseSpec {
  type: 'residualPlot';
  /** 残差趋势线；不改变生成残差的模型。 */
  smooth?: false | LowessRegressionOptions;
}
export interface ResidualObservationsSpec extends ResidualBase {
  input: 'observations';
  data: RegressionObservation[];
  regression?: RegressionOptions;
  xAxis?: 'predictor' | 'fitted';
  fieldLabels?: { x?: string; y?: string; fittedValue?: string; residual?: string };
}
export interface ResidualPredictionsSpec extends ResidualBase {
  input: 'predictions';
  data: ResidualPredictionRow[];
  fieldLabels?: { fittedValue?: string; residual?: string };
}
export interface ResidualResultsSpec extends ResidualBase {
  input: 'residuals';
  data: ResidualPlotRow[];
  residualKind: 'raw' | 'standardized' | 'studentized';
  fieldLabels?: { fittedValue?: string; residual?: string };
}
export type ResidualPlotSpec = ResidualObservationsSpec | ResidualPredictionsSpec | ResidualResultsSpec;
