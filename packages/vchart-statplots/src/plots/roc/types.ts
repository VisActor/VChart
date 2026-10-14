import type { BaseSpec, SeriesRow } from '../../common/types';

/** 逐样本二分类预测；true 为正例，较大分数表示更倾向正例。 */
export interface BinaryScoreRow extends SeriesRow {
  actual: boolean;
  /** 任意有限预测分数，不要求为概率。 */
  score: number;
}
export type RocCurveRow = BinaryScoreRow;
export interface RocCurveSpec extends BaseSpec {
  type: 'rocCurve';
  data: RocCurveRow[];
  /** 展示生成的曲线统计量，不改变原始输入字段。 */
  fieldLabels?: { fpr?: string; tpr?: string };
}
