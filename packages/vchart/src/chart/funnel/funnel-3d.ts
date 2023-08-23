import { SeriesTypeEnum } from '../../series/interface';
import { ChartTypeEnum } from '../interface';
import { BaseFunnelChart } from './base';
import { VChart } from '../../core/vchart';
import { Funnel3dSeries } from '../../series/funnel/funnel-3d';
VChart.useSeries([Funnel3dSeries]);

export class Funnel3dChart extends BaseFunnelChart {
  static readonly type: string = ChartTypeEnum.funnel3d;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.funnel3d;
  readonly seriesType: string = SeriesTypeEnum.funnel3d;
}
