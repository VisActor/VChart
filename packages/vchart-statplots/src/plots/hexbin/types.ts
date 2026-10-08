import type { BaseSpec } from '../../common/types';
export interface HexbinPlotRow {
  x: number;
  y: number;
}
export interface HexbinBinningSpec {
  /** 水平方向的分箱分辨率，默认 30；不是非空箱总数，边缘可增加一列。
   * @TJS-type integer
   * @minimum 1
   * @maximum 200
   */
  xBins?: number;
}
export interface HexbinPlotSpec extends BaseSpec {
  type: 'hexbinPlot';
  data: HexbinPlotRow[];
  /** 原始散点的分箱规则；重复坐标按多条观测计数。 */
  binning?: HexbinBinningSpec;
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { x?: string; y?: string; count?: string };
}
