import type { IProgressChartSpec } from '../interface';
import type { ICartesianAxisSpec } from '../../../component/axis/cartesian/interface';
import type { ILinearProgressSeriesSpec } from '../../../series/progress/linear/interface';
import type { IChartExtendsSeriesSpec } from '../../..';
export interface ILinearProgressChartSpec
  extends IProgressChartSpec,
    IChartExtendsSeriesSpec<ILinearProgressSeriesSpec> {
  type: 'linearProgress';
  axes?: ICartesianAxisSpec[];
  series?: ILinearProgressSeriesSpec[];
}
