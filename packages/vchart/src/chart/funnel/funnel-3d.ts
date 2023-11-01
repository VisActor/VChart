import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import { BaseFunnelChart } from './base';
import { registerFunnel3dSeries } from '../../series/funnel/funnel-3d';
import { Factory } from '../../core/factory';

export class Funnel3dChart extends BaseFunnelChart {
  static readonly type: string = ChartTypeEnum.funnel3d;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.funnel3d;
  readonly seriesType: string = SeriesTypeEnum.funnel3d;
}

export const registerFunnel3dChart = () => {
  registerFunnel3dSeries();
  Factory.registerChart(Funnel3dChart.type, Funnel3dChart);
};
