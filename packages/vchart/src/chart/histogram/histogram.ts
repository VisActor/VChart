import { registerBarSeries } from '../../series/bar/bar';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import { BaseHistogramChart } from './base';
import { setDefaultCrosshairForCartesianChart } from '../util';
import { Factory } from '../../core/factory';
import type { IHistogramChartSpec } from './interface';

export class HistogramChart<T extends IHistogramChartSpec = IHistogramChartSpec> extends BaseHistogramChart<T> {
  static readonly type: string = ChartTypeEnum.histogram;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.histogram;
  readonly seriesType: string = SeriesTypeEnum.bar;

  transformSpec(spec: T): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}

export const registerHistogramChart = () => {
  registerBarSeries();
  Factory.registerChart(HistogramChart.type, HistogramChart);
};
