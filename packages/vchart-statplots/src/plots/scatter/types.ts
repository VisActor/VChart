import type { BaseSpec, SeriesRow, Interval } from '../../common/types';
/** 预计算统计结果；本包不拟合模型。 */
export interface ScatterPlotRow extends SeriesRow {
  x: number;
  y: number;
  id?: string;
}
export interface FitRow extends SeriesRow {
  x: number;
  estimate: number;
  lower?: number;
  upper?: number;
}
export interface ScatterPlotSpec extends BaseSpec {
  type: 'scatterPlot';
  data: ScatterPlotRow[];
  fit?: { method: string; data: FitRow[]; interval?: Interval };
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { x?: string; y?: string };
}
