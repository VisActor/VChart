import type { BaseSpec, SeriesRow } from '../../common/types';
export interface EcdfPlotRow extends SeriesRow {
  value: number;
  /** 累计概率，范围 0–1；同一系列中随 value 非递减。 */
  cumulativeProbability: number;
}
export interface EcdfPlotSpec extends BaseSpec {
  type: 'ecdfPlot';
  data: EcdfPlotRow[];
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { value?: string; cumulativeProbability?: string };
}
