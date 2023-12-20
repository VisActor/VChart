import type { IChartExtendsSeriesSpec } from '../../typings';
import type { IFunnelSeriesSpec, IFunnel3dSeriesSpec } from '../../series/funnel/interface';
import type { IChartSpec } from '../../typings/spec';

export interface IFunnelChartSpec extends IChartSpec, IChartExtendsSeriesSpec<IFunnelSeriesSpec> {
  type: 'funnel';
}

export interface IFunnel3dChartSpec extends IChartSpec, IChartExtendsSeriesSpec<IFunnel3dSeriesSpec> {
  type: 'funnel3d';
}
