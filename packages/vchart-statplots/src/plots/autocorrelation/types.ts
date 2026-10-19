import type { BaseSpec, SeriesRow } from '../../common/types';
/** 按每系列的输入顺序表示等间隔原始序列，不能按数值排序。 */
export interface AutocorrelationPlotRow extends SeriesRow {
  value: number;
}
export interface AutocorrelationPlotSpec extends BaseSpec {
  type: 'autocorrelationPlot';
  data: AutocorrelationPlotRow[];
  /** 默认 acf；pacf 采用 Yule–Walker MLE。 */
  method?: 'acf' | 'pacf';
  /** 最高滞后，整数 1–512，另受每组样本量限制。 */
  maxLag?: number;
  /** 默认 95% 零中心置信带；false 关闭。 */
  confidence?: false | { level?: number };
  fieldLabels?: { lag?: string; correlation?: string };
}
