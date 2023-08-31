import { BarSeries } from './../../series/bar/bar';
import { SeriesTypeEnum } from '../../series/interface';
import { ChartTypeEnum } from '../interface';
import { BaseHistogramChart } from './base';
import { setDefaultCrosshairForCartesianChart } from '../util';
import { VChart } from '../../core/vchart';
VChart.useSeries([BarSeries]);

export class HistogramChart extends BaseHistogramChart {
  static readonly type: string = ChartTypeEnum.histogram;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.histogram;
  readonly seriesType: string = SeriesTypeEnum.bar;

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    setDefaultCrosshairForCartesianChart(spec);
  }
}
