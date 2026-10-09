import type { BaseSpec, SeriesRow } from '../../common/types';
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
  fieldLabels?: { fittedValue?: string; residual?: string };
}
export interface ResidualPredictionsSpec extends ResidualBase {
  input: 'predictions';
  data: ResidualPredictionRow[];
}
export interface ResidualResultsSpec extends ResidualBase {
  input: 'residuals';
  data: ResidualPlotRow[];
  residualKind: 'raw' | 'standardized' | 'studentized';
}
export type ResidualPlotSpec = ResidualPredictionsSpec | ResidualResultsSpec;
