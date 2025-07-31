import type {
  IBoxPlotSeriesSpec,
  IBoxPlotChartSpec,
  SeriesMarkNameEnum,
  IMarkSpec,
  ICommonSpec,
  IMarkRaw
} from '@visactor/vchart';
import type { CandlestickType } from './constants';

/**
 * 蜡烛图标记配置项接口
 */
export interface ICandlestickMarkSpec extends ICommonSpec {
  /** 蜡烛图主体宽度 */
  bodySize?: number;
  /** 主体填充颜色 */
  bodyFill?: string;
  /** 主体描边颜色 */
  bodyStroke?: string;
  /** 主体描边宽度 */
  bodyLineWidth?: number;
  /** 主体整体透明度 */
  bodyOpacity?: number;
  /** 主体填充透明度 */
  bodyFillOpacity?: number;
  /** 主体描边透明度 */
  bodyStrokeOpacity?: number;

  /** 影线描边颜色 */
  shadowStroke?: string;
  /** 影线描边宽度 */
  shadowLineWidth?: number;
  /** 影线透明度 */
  shadowOpacity?: number;
}

/** 蜡烛图标记类型 */
export type ICandlestickMark = IMarkRaw<ICandlestickMarkSpec>;

/**
 * 蜡烛图基础配置接口
 */
export interface ICandlestickSpec {
  /** 开盘价数据字段 */
  openField: string;
  /** 收盘价数据字段 */
  closeField: string;
  /** 最高价数据字段 */
  highField: string;
  /** 最低价数据字段 */
  lowField: string;

  /**
   * 蜡烛图样式配置
   * 优先级高于下方的 upStyle、downStyle、noChangeStyle
   */
  candlestick?: IMarkSpec<ICandlestickMarkSpec>;

  /**
   * 收盘价 > 开盘价 时的样式配置
   */
  upStyle?: ICandlestickMarkSpec;
  /**
   * 收盘价 < 开盘价 时的样式配置
   */
  downStyle?: ICandlestickMarkSpec;
  /**
   * 收盘价 = 开盘价 时的样式配置
   */
  noChangeStyle?: ICandlestickMarkSpec;
}

export interface ICandlestickSeriesSpecBase
  extends Omit<
      IBoxPlotSeriesSpec,
      'minField' | 'maxField' | 'q1Field' | 'medianField' | 'q3Field' | 'outliersField' | SeriesMarkNameEnum.boxPlot
    >,
    ICandlestickSpec {}

export interface ICandlestickChartSpecBase extends IBoxPlotChartSpec, ICandlestickSpec {}

export interface ICandlestickSeriesSpec extends Omit<ICandlestickSeriesSpecBase, 'type' | 'series'> {
  type: typeof CandlestickType;
}

export interface ICandlestickChartSpec extends Omit<ICandlestickChartSpecBase, 'type' | 'series'> {
  type: typeof CandlestickType;
}
