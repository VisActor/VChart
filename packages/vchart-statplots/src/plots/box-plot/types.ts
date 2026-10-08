import type { BaseSpec, SeriesRow } from '../../common/types';
export interface BoxPlotRow extends SeriesRow {
  category: string;
  /** 原始观测；重复值分别参与统计。 */
  value: number;
}
export interface BoxPlotWhiskersSpec {
  /** IQR 围栏倍数，默认 1.5；有限且非负。
   * @minimum 0
   */
  iqrMultiplier?: number;
}
export interface BoxPlotSpec extends BaseSpec {
  type: 'boxPlot';
  data: BoxPlotRow[];
  /** 编译阶段计算须和异常值的规则。 */
  whiskers?: BoxPlotWhiskersSpec;
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { category?: string; value?: string };
}
