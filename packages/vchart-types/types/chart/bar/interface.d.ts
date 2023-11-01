import type { IBarSeriesSpec, IBar3dSeriesSpec } from '../../series/bar/interface';
import type { IChartExtendsSeriesSpec } from '../../typings/spec/common';
import type { ICartesianChartSpec } from '../cartesian/interface';
export interface IBarChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<IBarSeriesSpec> {
    type: 'bar';
    series?: IBarSeriesSpec[];
}
export interface IBar3dChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<IBar3dSeriesSpec> {
    type: 'bar3d';
    series?: IBar3dSeriesSpec[];
}
