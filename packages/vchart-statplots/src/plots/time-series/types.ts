import type { BaseSpec, SeriesRow, Interval } from '../../common/types';
import type { SampleErrorBar } from '../../common/sample-estimate-types';
export interface TimeSeriesObservation extends SeriesRow {
  /** 带时区的 ISO 8601 时间；允许乱序及重复时刻。 */ time: string;
  value: number | null;
}
export interface TimeSeriesEstimate extends TimeSeriesObservation {
  lower?: number;
  upper?: number;
}
export type TimeSeriesPlotRow = TimeSeriesEstimate;
interface TimeSeriesBase extends BaseSpec {
  type: 'timeSeriesPlot';
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { time?: string; value?: string };
}
interface TimeSeriesObservationsBase extends TimeSeriesBase {
  input: 'observations';
  data: TimeSeriesObservation[];
}
/** 默认均值及 95% bootstrap CI（1000 次，seed 0）；false 直接稳定排序连线。 */
export type TimeSeriesObservationsSpec = TimeSeriesObservationsBase &
  ({ estimator?: 'mean' | 'median'; errorBar?: SampleErrorBar } | { estimator: false; errorBar?: false });
export interface TimeSeriesEstimatesSpec extends TimeSeriesBase {
  input: 'estimates';
  data: TimeSeriesEstimate[];
  interval?: Interval;
}
export type TimeSeriesPlotSpec = TimeSeriesObservationsSpec | TimeSeriesEstimatesSpec;
