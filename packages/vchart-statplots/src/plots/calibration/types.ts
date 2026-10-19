import type { BaseSpec, SeriesRow } from '../../common/types';
/** 每行是一条真实二分类标签与预测正例概率。 */
export interface CalibrationCurveRow extends SeriesRow {
  actual: boolean;
  probability: number;
}
export interface CalibrationCurveSpec extends BaseSpec {
  type: 'calibrationCurve';
  data: CalibrationCurveRow[];
  binning?: {
    /** 箱数，默认 5，整数范围 1–512。 */
    binCount?: number;
    /** 默认 uniform；quantile 按系列独立确定边界。 */
    strategy?: 'uniform' | 'quantile';
  };
  fieldLabels?: { meanPredictedProbability?: string; observedRate?: string };
}
