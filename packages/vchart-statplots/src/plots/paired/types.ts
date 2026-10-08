import type { BaseSpec, SeriesRow } from '../../common/types';
/** 预计算统计结果；本包不拟合模型。 */
export interface PairedComparisonPlotRow extends SeriesRow {
  id: string;
  category: string;
  value: number;
}
export interface PairedComparisonPlotSpec extends BaseSpec {
  type: 'pairedComparisonPlot';
  data: PairedComparisonPlotRow[];
  /** 同一对象比较的两个不同状态，数组顺序即显示顺序。 */
  categoryOrder: [string, string];
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { category?: string; value?: string };
}
