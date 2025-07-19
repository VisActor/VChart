import { CandlestickChartSpecTransformer } from './candlestick-transformer';
import { ICandlestickChartSpec } from './interface';
import { registerCandlestickSeries } from './series/candlestick';
import { BaseChart, Factory } from '@visactor/vchart';
export class CandlestickChart<T extends ICandlestickChartSpec = ICandlestickChartSpec> extends BaseChart<T> {
  static readonly type: string = 'candlestick';
  static readonly seriesType: string = 'candlestick';
  static readonly transformerConstructor = CandlestickChartSpecTransformer; // CandlestickChartSpecTransformer;
}

export const registerCandlestickChart = () => {
  //registerDimensionTooltipProcessor();
  //registerMarkTooltipProcessor();
  //registerDimensionEvents();
  //registerDimensionHover();
  registerCandlestickSeries();
  Factory.registerChart(CandlestickChart.type, CandlestickChart);
};
