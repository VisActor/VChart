import type { BaseSpec, Interval, SeriesRow } from '../../common/types';
export interface PointIntervalPlotRow extends SeriesRow {
  category: string;
  estimate: number;
  lower: number;
  upper: number;
}
export interface PointIntervalPlotSpec extends BaseSpec {
  type: 'pointIntervalPlot';
  data: PointIntervalPlotRow[];
  interval: Interval;
  /** 显式参考线；数值及统计含义由调用方提供。 */
  referenceLine?: { value: number; label?: string };
  /** 估计值轴尺度，默认 linear；log 要求估计、区间端点及参考值为正。 */
  valueScale?: 'linear' | 'log';
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { category?: string; estimate?: string };
}
