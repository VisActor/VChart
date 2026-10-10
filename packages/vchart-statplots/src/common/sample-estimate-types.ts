export type SampleErrorBar =
  | false
  | { kind: 'confidence'; level?: number; resamples?: number; seed?: number }
  | { kind: 'percentile'; level?: number }
  | { kind: 'standardError'; multiplier?: number }
  | { kind: 'standardDeviation'; multiplier?: number }
  | { kind: 'range' };
export interface SampleEstimateOptions {
  estimator?: 'mean' | 'median';
  errorBar?: SampleErrorBar;
}
export interface SampleEstimate {
  estimate: number;
  lower: number | null;
  upper: number | null;
  sampleCount: number;
  interval: string;
}
