import { SeriesTypeEnum } from '../../series/interface/type';
import { BarChart } from '../bar';
import { ChartTypeEnum } from '../interface/type';
import type { IWaterfallChartSpec } from './interface';
import { registerWaterfallSeries } from '../../series/waterfall/waterfall';
import { Factory } from '../../core/factory';
import type { AdaptiveSpec } from '../../typings';
import { WaterfallChartSpecTransformer } from './waterfall-transformer';
import { registerDimensionHover } from '../../interaction/triggers/dimension-hover';

export class WaterfallChart<T extends IWaterfallChartSpec = IWaterfallChartSpec> extends BarChart<
  AdaptiveSpec<T, 'type' | 'series' | 'label'>
> {
  static readonly type: string = ChartTypeEnum.waterfall;
  static readonly seriesType: string = SeriesTypeEnum.waterfall;
  static readonly transformerConstructor = WaterfallChartSpecTransformer;
  // @ts-ignore
  readonly transformerConstructor = WaterfallChartSpecTransformer;
  readonly type: string = ChartTypeEnum.waterfall;
  readonly seriesType: string = SeriesTypeEnum.waterfall;
}

export const registerWaterfallChart = () => {
  registerDimensionHover();
  registerWaterfallSeries();
  Factory.registerChart(WaterfallChart.type, WaterfallChart);
};
