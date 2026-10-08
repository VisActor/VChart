import type { BaseSpec, SeriesRow } from '../../common/types';
export interface KdePlotRow extends SeriesRow {
  value: number;
  density: number;
}
export interface KdePlotSpec extends BaseSpec {
  type: 'kdePlot';
  data: KdePlotRow[];
  /** 结果说明；修改此项不会重新计算 KDE。 */
  estimation?: { kernel: string; bandwidth: number };
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { value?: string; density?: string };
}
