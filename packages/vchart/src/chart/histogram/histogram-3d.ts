import { SeriesTypeEnum } from '../../series/interface';
import { ChartTypeEnum } from '../interface';
import { BaseHistogramChart } from './base';
import { VChart } from '../../core/vchart';
import { Bar3dSeries } from '../../series';
VChart.useSeries([Bar3dSeries]);

export class Histogram3dChart extends BaseHistogramChart {
  static readonly type: string = ChartTypeEnum.histogram3d;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.histogram3d;
  readonly seriesType: string = SeriesTypeEnum.bar3d;
}
