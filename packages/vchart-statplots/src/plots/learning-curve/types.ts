import type { BaseSpec, SeriesRow, Interval } from '../../common/types';
export interface LearningCurveRow extends SeriesRow {
  trainSize: number;
  split: 'train' | 'validation';
  score: number;
  lower?: number;
  upper?: number;
}
export interface LearningCurveFoldRow extends SeriesRow {
  trainSize: number;
  fold: string;
  split: 'train' | 'validation';
  score: number;
}
interface LearningCurveBase extends BaseSpec {
  type: 'learningCurve';
  metric: string;
  fieldLabels?: { trainSize?: string; score?: string };
}
export interface LearningCurveFoldsSpec extends LearningCurveBase {
  input: 'folds';
  data: LearningCurveFoldRow[];
  spread?: false | { multiplier?: number };
}
export interface LearningCurveSummariesSpec extends LearningCurveBase {
  input: 'summaries';
  data: LearningCurveRow[];
  interval?: Interval;
}
export type LearningCurveSpec = LearningCurveFoldsSpec | LearningCurveSummariesSpec;
