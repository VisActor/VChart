import { array } from '@visactor/vutils';
import { SeriesTypeEnum } from '../../series/interface/type';
import { BarChart, BarChartSpecTransformer } from '../bar';
import { ChartTypeEnum } from '../interface/type';
import type { IWaterfallChartSpec } from './interface';
import { setDefaultCrosshairForCartesianChart } from '../util';
import { registerWaterfallSeries } from '../../series/waterfall/waterfall';
import { Factory } from '../../core/factory';
import type { AdaptiveSpec } from '../..';

export class WaterfallChartSpecTransformer<
  T extends IWaterfallChartSpec = IWaterfallChartSpec
> extends BarChartSpecTransformer<AdaptiveSpec<T, 'type' | 'series' | 'label'>> {
  transformSpec(spec: AdaptiveSpec<T, 'type' | 'series' | 'label'>): void {
    super.transformSpec(spec);
    if (spec.legends) {
      array(spec.legends).forEach((l: any) => {
        l.select = false;
        l.hover = false;
        l.filter = false;
      });
    }

    setDefaultCrosshairForCartesianChart(spec);
  }

  protected _getDefaultSeriesSpec(spec: AdaptiveSpec<T, 'type' | 'series' | 'label'>): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      bar: spec.bar,
      stackLabel: spec.stackLabel,
      leaderLine: spec.leaderLine,
      total: spec.total
    };
  }
}

export class WaterfallChart<T extends IWaterfallChartSpec = IWaterfallChartSpec> extends BarChart<
  AdaptiveSpec<T, 'type' | 'series' | 'label'>
> {
  static readonly type: string = ChartTypeEnum.waterfall;
  static readonly seriesType: string = SeriesTypeEnum.waterfall;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = WaterfallChartSpecTransformer;
  // @ts-ignore
  readonly transformerConstructor = WaterfallChartSpecTransformer;
  readonly type: string = ChartTypeEnum.waterfall;
  readonly seriesType: string = SeriesTypeEnum.waterfall;
}

export const registerWaterfallChart = () => {
  registerWaterfallSeries();
  Factory.registerChart(WaterfallChart.type, WaterfallChart);
};
