import type { BaseSpec, SeriesRow } from '../../common/types';
/** 原始逐条观测，保留个体标识。 */
export interface StripPlotRow extends SeriesRow {
  id: string;
  category: string;
  value: number;
}
export interface StripPlotSpec extends BaseSpec {
  type: 'stripPlot';
  data: StripPlotRow[];
  layout?: 'strip' | 'jitter' | 'swarm';
  /** 最大偏移占完整分类带宽的比例，0–0.5；仅 jitter 布局允许，默认 0.3。 */
  jitterRatio?: number;
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { category?: string; value?: string };
}
