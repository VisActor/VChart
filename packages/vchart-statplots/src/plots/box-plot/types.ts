import type { BaseSpec, SeriesRow } from '../../common/types';
export interface BoxPlotRow extends SeriesRow {
  category: string;
  q1: number;
  median: number;
  q3: number;
  /** 下须端点，由 whiskerRule 定义，不自动等同于最小值。 */
  whiskerLower: number;
  /** 上须端点，由 whiskerRule 定义，不自动等同于最大值。 */
  whiskerUpper: number;
  outliers?: number[];
}
export interface BoxPlotSpec extends BaseSpec {
  type: 'boxPlot';
  data: BoxPlotRow[];
  /** 须的定义，例如“1.5×IQR 内最远观测”，不自动推断。 */
  whiskerRule: string;
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { category?: string; value?: string };
}
