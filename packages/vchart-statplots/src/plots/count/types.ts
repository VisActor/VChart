import type { BaseSpec, SeriesRow } from '../../common/types';
/** 预计算统计结果；本包不拟合模型。 */
export interface CountPlotRow extends SeriesRow {
  category: string;
  count: number;
}
export interface CountPlotSpec extends BaseSpec {
  type: 'countPlot';
  data: CountPlotRow[];
  /** 显示统计量，默认 count；proportion 为同一 series 内的计数比例。 */
  statistic?: 'count' | 'proportion';
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { category?: string; count?: string; proportion?: string };
}
