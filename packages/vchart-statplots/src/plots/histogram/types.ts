import type { BaseSpec, SeriesRow } from '../../common/types';

export interface HistogramRow extends SeriesRow {
  binStart: number;
  binEnd: number;
  count: number;
}
export interface HistogramSpec extends BaseSpec {
  type: 'histogram';
  data: HistogramRow[];
  /** 显示统计量，默认 count；proportion 为系列内比例，density 为单位数值区间的概率密度。 */
  statistic?: 'count' | 'proportion' | 'density';
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { value?: string; count?: string; proportion?: string; density?: string };
}
