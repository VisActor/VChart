import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import { BaseFunnelChart } from './base';
import { registerFunnel3dSeries } from '../../series/funnel/funnel-3d';
import { Factory } from '../../core/factory';
import type { IFunnel3dChartSpec } from './interface';
import type { AdaptiveSpec } from '../..';

export class Funnel3dChart<T extends IFunnel3dChartSpec = IFunnel3dChartSpec> extends BaseFunnelChart<
  AdaptiveSpec<T, 'type'>
> {
  static readonly type: string = ChartTypeEnum.funnel3d;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.funnel3d;
  readonly seriesType: string = SeriesTypeEnum.funnel3d;
}

export const registerFunnel3dChart = () => {
  registerFunnel3dSeries();
  Factory.registerChart(Funnel3dChart.type, Funnel3dChart);
};
