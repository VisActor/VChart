import { registerBar3dSeries } from '../../series/bar/bar-3d';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import type { IBar3dChartSpec } from './interface';
import { Factory } from '../../core/factory';
import { BarChart, BarChartSpecTransformer } from './bar';
import type { AdaptiveSpec } from '../..';

export class Bar3dChartSpecTransformer<T extends IBar3dChartSpec = IBar3dChartSpec> extends BarChartSpecTransformer<
  AdaptiveSpec<T, 'type' | 'series'>
> {
  protected _getDefaultSeriesSpec(spec: AdaptiveSpec<T, 'type' | 'series'>): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      barWidth: spec.barWidth,
      barMaxWidth: spec.barMaxWidth,
      barMinWidth: spec.barMinWidth,
      barGapInGroup: spec.barGapInGroup
    };
  }
}

export class Bar3dChart<T extends IBar3dChartSpec = IBar3dChartSpec> extends BarChart<
  AdaptiveSpec<T, 'type' | 'series'>
> {
  static readonly type: string = ChartTypeEnum.bar3d;
  static readonly seriesType: string = SeriesTypeEnum.bar3d;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = Bar3dChartSpecTransformer;
  // @ts-ignore
  readonly transformerConstructor = Bar3dChartSpecTransformer;
  readonly type: string = ChartTypeEnum.bar3d;
  readonly seriesType: string = SeriesTypeEnum.bar3d;
}

export const registerBar3dChart = () => {
  registerBar3dSeries();
  Factory.registerChart(Bar3dChart.type, Bar3dChart);
};
