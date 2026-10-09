import type { BaseSpec, SeriesRow, Interval } from '../../common/types';
/** 原始时间观测；可选区间结果由外部提供。 */
export interface TimeSeriesPlotRow extends SeriesRow {
  /** 带时区的 ISO 8601 时间。 */ time: string;
  value: number | null;
  lower?: number;
  upper?: number;
}
export interface TimeSeriesPlotSpec extends BaseSpec {
  type: 'timeSeriesPlot';
  data: TimeSeriesPlotRow[];
  interval?: Interval;
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { time?: string; value?: string };
}
