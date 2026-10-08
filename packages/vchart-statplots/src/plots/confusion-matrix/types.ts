import type { BaseSpec } from '../../common/types';
/** 预计算统计结果；本包不拟合模型。 */
export interface ConfusionMatrixRow {
  actual: string;
  predicted: string;
  count: number;
}
export interface ConfusionMatrixSpec extends BaseSpec {
  type: 'confusionMatrix';
  data: ConfusionMatrixRow[];
  /** 默认 none；actual 按实际类别、predicted 按预测类别、all 按全部计数归一化。 */
  normalization?: 'none' | 'actual' | 'predicted' | 'all';
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { actual?: string; predicted?: string; count?: string; proportion?: string };
}
