import { registerFunnelSeries } from './../../series/funnel/funnel';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import { BaseFunnelChart } from './base';
import { Factory } from '../../core/factory';

export class FunnelChart extends BaseFunnelChart {
  static readonly type: string = ChartTypeEnum.funnel;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.funnel;
  readonly seriesType: string = SeriesTypeEnum.funnel;
}

export const registerFunnelChart = () => {
  registerFunnelSeries();
  Factory.registerChart(FunnelChart.type, FunnelChart);
};
