import type { BaseSpec, SeriesRow, Interval } from '../../common/types';
/** 统计量由调用方计算；只负责可视化。 */
export interface AutocorrelationPlotRow extends SeriesRow {
  lag: number;
  /** 外部 ACF/PACF 估计值；保留无偏估计可能超出 [-1,1] 的结果。 */
  correlation: number;
  lower?: number;
  upper?: number;
}
export interface AutocorrelationPlotSpec extends BaseSpec {
  type: 'autocorrelationPlot';
  data: AutocorrelationPlotRow[];
  /** 外部计算方法或结果类型说明；本包不重新拟合或估计。 */
  method: 'acf' | 'pacf';
  interval?: Interval;
  /** 字段的轴和 tooltip 展示名称；不改输入字段，不控制图元数据标签。 */
  fieldLabels?: { lag?: string; correlation?: string };
}
