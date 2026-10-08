import type { BaseSpec } from '../../common/types';
export interface HexbinPlotRow {
  id: string;
  count: number;
  /** 按周界顺序给定六个数据坐标顶点，不包含重复闭合点。 */ vertices: { x: number; y: number }[];
}
export interface HexbinPlotSpec extends BaseSpec {
  type: 'hexbinPlot';
  data: HexbinPlotRow[];
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { x?: string; y?: string; count?: string };
}
