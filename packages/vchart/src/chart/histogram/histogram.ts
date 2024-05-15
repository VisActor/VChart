import { registerBarSeries } from '../../series/bar/bar';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import { BaseHistogramChart } from './base/base';
import { Factory } from '../../core/factory';
import type { IHistogramChartSpec } from './interface';
import { HistogramChartSpecTransformer } from './histogram-transformer';

export class HistogramChart<T extends IHistogramChartSpec = IHistogramChartSpec> extends BaseHistogramChart<T> {
  static readonly type: string = ChartTypeEnum.histogram;
  static readonly seriesType: string = SeriesTypeEnum.bar;
  static readonly transformerConstructor = HistogramChartSpecTransformer;
  readonly transformerConstructor = HistogramChartSpecTransformer;
  readonly type: string = ChartTypeEnum.histogram;
  readonly seriesType: string = SeriesTypeEnum.bar;
}

export const registerHistogramChart = () => {
  registerBarSeries();
  Factory.registerChart(HistogramChart.type, HistogramChart);
};
