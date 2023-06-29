import { SeriesTypeEnum } from '../../series/interface';
import { ChartTypeEnum } from '../interface';
import { BaseFunnelChart } from './base';
import { VChart } from '../../core/vchart';
import { FunnelSeries } from '../../series';
VChart.useSeries([FunnelSeries]);

export class FunnelChart extends BaseFunnelChart {
  static readonly type: string = ChartTypeEnum.funnel;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.funnel;
  readonly seriesType: string = SeriesTypeEnum.funnel;
}
