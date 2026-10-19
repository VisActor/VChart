import type { BaseSpec } from '../../common/types';
export interface ShapBeeswarmPlotRow {
  id: string;
  feature: string;
  shapValue: number;
  featureValue: number | null;
}
export interface ShapBeeswarmPlotSpec extends BaseSpec {
  type: 'shapBeeswarmPlot';
  data: ShapBeeswarmPlotRow[];
  featureOrder: string[];
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { feature?: string; shapValue?: string; featureValue?: string };
}
