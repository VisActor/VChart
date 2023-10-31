import type { IChartExtendsSeriesSpec } from '../../typings/spec/common';
import type { IRangeColumnSeriesSpec, IRangeColumn3dSeriesSpec } from '../../series/range-column/interface';
import type { ICartesianChartSpec } from '../cartesian/interface';
export interface IRangeColumnChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<IRangeColumnSeriesSpec> {
    type: 'rangeColumn';
    series?: IRangeColumnSeriesSpec[];
}
export interface IRangeColumn3dChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<IRangeColumn3dSeriesSpec> {
    type: 'rangeColumn3d';
    series?: IRangeColumn3dSeriesSpec[];
}
