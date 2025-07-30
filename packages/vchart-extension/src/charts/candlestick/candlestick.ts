import { CandlestickChartSpecTransformer } from './candlestick-transformer';
import { ICandlestickChartSpec } from './interface';
import { registerCandlestickSeries } from './series/candlestick';
import {
  BaseChart,
  Factory,
  registerMarkTooltipProcessor,
  registerDimensionTooltipProcessor,
  registerDimensionEvents,
  registerDimensionHover
} from '@visactor/vchart';
import { CANDLESTICK_CHART_TYPE, CANDLESTICK_SERIES_TYPE } from './series/constant';
export class CandlestickChart<T extends ICandlestickChartSpec = ICandlestickChartSpec> extends BaseChart<T> {
  static readonly type: string = CANDLESTICK_CHART_TYPE;
  static readonly seriesType: string = CANDLESTICK_SERIES_TYPE;
  static readonly transformerConstructor = CandlestickChartSpecTransformer; // CandlestickChartSpecTransformer;
}

export const registerCandlestickChart = () => {
  registerDimensionTooltipProcessor();
  registerMarkTooltipProcessor();
  registerDimensionEvents();
  registerDimensionHover();
  registerCandlestickSeries();
  Factory.registerChart(CandlestickChart.type, CandlestickChart);
};
