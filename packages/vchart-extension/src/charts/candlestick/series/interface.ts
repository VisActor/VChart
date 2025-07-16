import type {
  IAnimationSpec,
  IMarkSpec,
  ICartesianSeriesSpec,
  SeriesMarkNameEnum,
  IMarkTheme,
  ICartesianSeriesTheme
} from '@visactor/vchart';
import type { ICandlestickMarkSpec } from '../mark';

export type candlestickColorConfig = {
  /**
   * 上涨蜡烛图颜色
   */
  rising: string;
  /**
   * 下跌蜡烛图颜色
   */
  falling: string;
  /**
   * 平盘蜡烛图颜色
   */
  doji: string;
};

export interface ICandlestickSeriesSpec
  extends Omit<ICartesianSeriesSpec, 'xField' | 'yField' | 'direction'>,
    IAnimationSpec<SeriesMarkNameEnum.boxPlot, string> {
  type: 'candlestick';
  /**
   * 时间轴字段
   */
  xField: string | string[];
  /**
   * 开盘价字段
   */
  openField?: string;
  /**
   * 最高价字段
   */
  highField?: string;
  /**
   * 最低价字段
   */
  lowField?: string;
  /**
   * 收盘价字段
   */
  closeField?: string;
  /**
   * 蜡烛图颜色配置
   */
  candlestickColor?: candlestickColorConfig;
  /**
   * 蜡烛图标记配置
   */
  candlestick?: IMarkSpec<ICandlestickMarkSpec>;
}

export interface ICandlestickSeriesTheme extends ICartesianSeriesTheme {
  candlestick?: Partial<IMarkTheme<ICandlestickMarkSpec>>;
}
