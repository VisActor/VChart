import type { IChartExtendsSeriesSpec, IChartSpec } from '../../typings/spec/common';
import type { IMapSeriesSpec } from '../../series/map/interface';

export interface IPictogramChartSpec extends IChartSpec, IChartExtendsSeriesSpec<any> {
  type: 'pictogram';
  series?: IMapSeriesSpec[];
}
