import type { BaseSpec } from '../../common/types';

export interface HistogramRow {
  value: number;
}
export interface HistogramBinningSpec {
  /** 非恒定数据的等宽箱数；省略时按样本量选择。
   * @TJS-type integer
   * @minimum 1
   * @maximum 200
   */
  binCount?: number;
}
export interface HistogramSpec extends BaseSpec {
  type: 'histogram';
  data: HistogramRow[];
  /** 原始观测的分箱规则；重复值分别计数。 */
  binning?: HistogramBinningSpec;
  /** 显示统计量，默认 count；proportion 为样本比例，density 为单位数值区间的概率密度。 */
  statistic?: 'count' | 'proportion' | 'density';
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { value?: string; count?: string; proportion?: string; density?: string };
}
