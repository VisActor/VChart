import type { IBarSeriesSpec, IBar3dSeriesSpec } from '../../series/bar/interface';
import type { IChartExtendsSeriesSpec } from '../../typings';
import type { ICartesianChartSpec } from '../cartesian/interface';
export interface IHistogramChartSpec extends ICartesianChartSpec, Omit<IChartExtendsSeriesSpec<IBarSeriesSpec>, 'type'> {
    type: 'histogram';
}
export interface IHistogram3dChartSpec extends ICartesianChartSpec, Omit<IChartExtendsSeriesSpec<IBar3dSeriesSpec>, 'type'> {
    type: 'histogram3d';
}
