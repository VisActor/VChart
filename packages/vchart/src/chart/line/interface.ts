import type { ICartesianChartSpec } from '../cartesian/interface';
import type { ILineSeriesSpec } from '../../series/line/interface';
import type { IChartExtendsSeriesSpec } from '../../typings';

export interface ILineChartSpec extends ICartesianChartSpec, IChartExtendsSeriesSpec<ILineSeriesSpec> {
  type: 'line';
  /** 系列配置 */
  series?: ILineSeriesSpec[];
}
