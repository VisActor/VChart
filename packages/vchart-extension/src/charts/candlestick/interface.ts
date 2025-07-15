import type { IChartExtendsSeriesSpec, IChartSpec } from '@visactor/vchart';
import type { ICandlestickSeriesSpec } from './series/interface';

export interface ICandlestickChartSpec extends IChartSpec, IChartExtendsSeriesSpec<any> {
  type: 'candlestick';
  /** 系列配置 */
  series?: ICandlestickSeriesSpec[];
}
