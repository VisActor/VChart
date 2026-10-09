import type { BaseSpec, Interval, SeriesRow } from '../../common/types';
export interface PointIntervalPlotRow extends SeriesRow {
  category: string;
  estimate: number;
  lower: number;
  upper: number;
}
export interface PointIntervalObservation extends SeriesRow {
  category: string;
  value: number;
}
export type PointIntervalErrorBar =
  | false
  | { kind: 'confidence'; level?: number; resamples?: number; seed?: number }
  | { kind: 'percentile'; level?: number }
  | { kind: 'standardError'; multiplier?: number }
  | { kind: 'standardDeviation'; multiplier?: number }
  | { kind: 'range' };
interface PointIntervalBase extends BaseSpec {
  type: 'pointIntervalPlot';
  referenceLine?: { value: number; label?: string };
  valueScale?: 'linear' | 'log';
  fieldLabels?: { category?: string; estimate?: string };
}
export interface PointIntervalObservationsSpec extends PointIntervalBase {
  input: 'observations';
  data: PointIntervalObservation[];
  estimator?: 'mean' | 'median';
  errorBar?: PointIntervalErrorBar;
}
export interface PointIntervalEstimatesSpec extends PointIntervalBase {
  input: 'estimates';
  data: PointIntervalPlotRow[];
  interval: Interval;
}
export type PointIntervalPlotSpec = PointIntervalObservationsSpec | PointIntervalEstimatesSpec;
