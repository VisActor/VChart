import type { BaseSpec } from '../../common/types';
export interface CorrelationMatrixRow {
  row: string;
  column: string;
  /** 相关系数，-1 至 1；无法计算时为 null。 */
  correlation: number | null;
}
export interface CorrelationMatrixSpec extends BaseSpec {
  type: 'correlationMatrix';
  /** 完整的对称矩阵；triangle 只影响显示。 */
  data: CorrelationMatrixRow[];
  /** 外部计算方法或结果类型说明；本包不重新拟合或估计。 */
  method: 'pearson' | 'spearman' | 'kendall';
  /** 显示完整矩阵或指定三角，默认 full；输入仍须完整对称。 */
  triangle?: 'full' | 'lower' | 'upper';
  /** 完整变量显示顺序；每个变量恰好出现一次，默认按数据首次出现排序。 */
  variableOrder?: string[];
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { row?: string; column?: string; correlation?: string };
}
