import type { IPieSeriesSpec, IPie3dSeriesSpec } from '../../series/pie/interface';
import type { IIndicatorSpec } from '../../component/indicator/interface';
import type { IChartExtendsSeriesSpec, IChartSpec } from '../../typings/spec/common';
export interface IPieChartSpec extends IChartSpec, IChartExtendsSeriesSpec<IPieSeriesSpec> {
  type: 'pie';
  indicator?: IIndicatorSpec;
}
export interface IPie3dChartSpec extends IChartSpec, IChartExtendsSeriesSpec<IPie3dSeriesSpec> {
  type: 'pie3d';
  indicator?: IIndicatorSpec;
}
