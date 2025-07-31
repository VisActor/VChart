import type {
  IBoxPlotSeriesSpec,
  IBoxPlotChartSpec,
  SeriesMarkNameEnum,
  IMarkSpec,
  ICommonSpec,
  IMarkRaw
} from '@visactor/vchart';
import type { CandlestickType } from './constants';

export interface ICandlestickMarkSpec extends ICommonSpec {
  bodySize?: number;
  bodyFill?: string;
  bodyStroke?: string;
  bodyLineWidth?: number;
  bodyOpacity?: number;
  bodyFillOpacity?: number;
  bodyStrokeOpacity?: number;

  shadowStroke?: string;
  shadowLineWidth?: number;
  shadowOpacity?: number;
}

export type ICandlestickMark = IMarkRaw<ICandlestickMarkSpec>;

export interface ICandlestickSpec {
  /**
   * 蜡烛图配置
   */
  openField: string;
  closeField: string;
  highField: string;
  lowField: string;

  /**
   * 蜡烛图样式配置
   */
  candlestick?: IMarkSpec<ICandlestickMarkSpec>;

  upStyle?: ICandlestickMarkSpec;
  downStyle?: ICandlestickMarkSpec;
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
