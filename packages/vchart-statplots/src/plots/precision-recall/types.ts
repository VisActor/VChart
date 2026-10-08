import type { BaseSpec, SeriesRow } from '../../common/types';
/** 预计算统计结果；本包不拟合模型。 */
export interface PrecisionRecallCurveRow extends SeriesRow {
  recall: number;
  precision: number;
  threshold?: number;
}
export interface PrecisionRecallCurveSpec extends BaseSpec {
  type: 'precisionRecallCurve';
  data: PrecisionRecallCurveRow[];
  /** 评价数据中的正例比例，0–1；提供时绘制 PR 基线，不由曲线推算。 */
  positiveRate?: number;
  metrics?: { series?: string; averagePrecision: number }[];
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { recall?: string; precision?: string };
}
