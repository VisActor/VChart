import type { IChartExtendsSeriesSpec } from '../..';
import type { IFunnelSeriesSpec } from '../../series/funnel/interface';
import type { IChartSpec } from '../../typings/spec';

export interface IFunnelChartSpec extends IChartSpec, IChartExtendsSeriesSpec<IFunnelSeriesSpec> {
  type: 'funnel';
}
