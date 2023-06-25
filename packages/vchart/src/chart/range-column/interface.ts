import type { IChartExtendsSeriesSpec } from '../../typings/spec/common';
import type { IRangeColumnSeriesSpec, IRangeColumn3dSeriesSpec } from '../../series/range-column/interface';
import type { ICartesianChartSpec } from '../cartesian/interface';

export interface IRangeColumnChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<IRangeColumnSeriesSpec> {
  /** 图表类型配置 */
  type: 'rangeColumn';
  /** 系列配置 */
  series?: IRangeColumnSeriesSpec[];
}

export interface IRangeColumn3dChartSpec
  extends ICartesianChartSpec,
    IChartExtendsSeriesSpec<IRangeColumn3dSeriesSpec> {
  /** 图表类型配置 */
  type: 'rangeColumn3d';
  /** 系列配置 */
  series?: IRangeColumn3dSeriesSpec[];
}
