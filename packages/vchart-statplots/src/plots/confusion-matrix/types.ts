import type { BaseSpec } from '../../common/types';
/** 每行是一条实际类别与预测类别观测，内部计数。 */
export interface ConfusionMatrixRow {
  actual: string;
  predicted: string;
}
export interface ConfusionMatrixSpec extends BaseSpec {
  type: 'confusionMatrix';
  data: ConfusionMatrixRow[];
  /** 完整显示顺序；可包含本批未出现类别，须覆盖所有输入类别。 */
  classOrder?: string[];
  /** 默认 none；actual 按实际类别、predicted 按预测类别、all 按全部计数归一化。 */
  normalization?: 'none' | 'actual' | 'predicted' | 'all';
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { actual?: string; predicted?: string; count?: string; proportion?: string };
}
