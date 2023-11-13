import type { ICartesianChartSpec } from '../cartesian/interface';
import type { ILineSeriesSpec } from '../../series/line/interface';
import type { IChartExtendsSeriesSpec } from '../..';
export interface ILineChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<ILineSeriesSpec> {
    type: 'line';
    series?: ILineSeriesSpec[];
}
