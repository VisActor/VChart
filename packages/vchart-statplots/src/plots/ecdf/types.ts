import type { BaseSpec, SeriesRow } from '../../common/types';
export interface EcdfPlotRow extends SeriesRow {
  /** 原始观测；无序和重复值均有效。 */
  value: number;
}
export interface EcdfPlotSpec extends BaseSpec {
  type: 'ecdfPlot';
  data: EcdfPlotRow[];
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { value?: string; cumulativeProbability?: string };
}
