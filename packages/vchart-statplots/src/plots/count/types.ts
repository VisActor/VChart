import type { BaseSpec, SeriesRow } from '../../common/types';
/** 每行表示一条原始分类观测，重复行分别计数。 */
export interface CountPlotRow extends SeriesRow {
  category: string;
}
export interface CountPlotSpec extends BaseSpec {
  type: 'countPlot';
  data: CountPlotRow[];
  /** 显示统计量，默认 count。 */
  statistic?: 'count' | 'proportion';
  /** proportion 的分母范围，默认 all；仅 proportion 模式可配置。 */
  normalizationScope?: 'all' | 'series';
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { category?: string; count?: string; proportion?: string };
}
