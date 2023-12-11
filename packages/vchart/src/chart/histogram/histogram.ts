import { registerBarSeries } from '../../series/bar/bar';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import { BaseHistogramChart, BaseHistogramChartSpecTransformer } from './base';
import { setDefaultCrosshairForCartesianChart } from '../util';
import { Factory } from '../../core/factory';
import type { IHistogramChartSpec } from './interface';

export class HistogramChartSpecTransformer<
  T extends IHistogramChartSpec = IHistogramChartSpec
> extends BaseHistogramChartSpecTransformer<T> {
  transformSpec(spec: T): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}

export class HistogramChart<T extends IHistogramChartSpec = IHistogramChartSpec> extends BaseHistogramChart<T> {
  static readonly type: string = ChartTypeEnum.histogram;
  static readonly seriesType: string = SeriesTypeEnum.bar;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = HistogramChartSpecTransformer;
  readonly transformerConstructor = HistogramChartSpecTransformer;
  readonly type: string = ChartTypeEnum.histogram;
  readonly seriesType: string = SeriesTypeEnum.bar;
}

export const registerHistogramChart = () => {
  registerBarSeries();
  Factory.registerChart(HistogramChart.type, HistogramChart);
};
