import type { BaseSpec, SeriesRow } from '../../common/types';

export interface RocCurveRow extends SeriesRow {
  /** 假阳性率，0–1。 */
  fpr: number;
  /** 真阳性率，0–1。 */
  tpr: number;
  /** 有限决策阈值；无穷阈值省略。 */
  threshold?: number;
}

export interface RocCurveSpec extends BaseSpec {
  type: 'rocCurve';
  data: RocCurveRow[];
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { fpr?: string; tpr?: string };
  /** 预先计算的曲线面积；本包不推算 AUC。 */
  metrics?: { series?: string; auc: number }[];
}
