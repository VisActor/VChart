import type { BaseSpec } from '../../common/types';
/** 统计量由调用方计算；只负责可视化。 */
export interface ScreePlotRow {
  component: number;
  explainedVarianceRatio: number;
}
export interface ScreePlotSpec extends BaseSpec {
  type: 'screePlot';
  data: ScreePlotRow[];
  /** 是否显示累计解释方差比例，默认 false。 */
  showCumulative?: boolean;
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { component?: string; explainedVarianceRatio?: string };
}
