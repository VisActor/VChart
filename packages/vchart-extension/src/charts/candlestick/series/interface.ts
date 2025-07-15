// candlestick/series/interface.ts
import type {
  IAnimationSpec,
  ICommonSpec,
  IMarkSpec,
  ICartesianSeriesSpec,
  SeriesMarkNameEnum,
  Datum
} from '@visactor/vchart';

export interface ICandlestickMarkSpec extends ICommonSpec {
  /**
   * box描边宽度
   */
  lineWidth?: number;
  /**
   * box宽度
   */
  boxWidth?: number;
  /**
   * 盒子填充颜色，为空则不填充
   */
  boxFill?: string | ((datum: Datum) => string);
  /**
   * 最低价
   */
  low?: (datum: Datum) => number;
  /**
   * 收盘价
   */
  close?: (datum: Datum) => number;
  /**
   * 开盘价
   */
  open?: (datum: Datum) => number;
  /**
   * 最高价
   */
  high?: (datum: Datum) => number;
}

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
  xField: string;
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
