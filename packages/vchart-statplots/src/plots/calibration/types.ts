import type { BaseSpec, SeriesRow, Interval } from '../../common/types';
/** 预计算统计结果；本包不拟合模型。 */
export interface CalibrationCurveRow extends SeriesRow {
  binStart: number;
  binEnd: number;
  /** 箱内平均预测概率，0–1，必须位于 binStart 与 binEnd 内。 */
  meanPredictedProbability: number;
  /** 箱内实际正例比例，范围 0–1。 */
  observedRate: number;
  count: number;
  lower?: number;
  upper?: number;
}
export interface CalibrationCurveSpec extends BaseSpec {
  type: 'calibrationCurve';
  data: CalibrationCurveRow[];
  interval?: Interval;
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { meanPredictedProbability?: string; observedRate?: string };
}
