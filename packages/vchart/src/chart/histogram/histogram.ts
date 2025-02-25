import { registerBarSeries } from '../../series/bar/bar';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import { BaseHistogramChart } from './base/base';
import { Factory } from '../../core/factory';
import type { IHistogramChartSpec } from './interface';
import { HistogramChartSpecTransformer } from './histogram-transformer';
import { registerDimensionHover } from '../../interaction/triggers/dimension-hover';

export class HistogramChart<T extends IHistogramChartSpec = IHistogramChartSpec> extends BaseHistogramChart<T> {
  static readonly type: string = ChartTypeEnum.histogram;
  static readonly seriesType: string = SeriesTypeEnum.bar;
  static readonly transformerConstructor = HistogramChartSpecTransformer;
  readonly transformerConstructor = HistogramChartSpecTransformer;
  readonly type: string = ChartTypeEnum.histogram;
  readonly seriesType: string = SeriesTypeEnum.bar;
}

export const registerHistogramChart = () => {
  registerDimensionHover();
  registerBarSeries();
  Factory.registerChart(HistogramChart.type, HistogramChart);
};
