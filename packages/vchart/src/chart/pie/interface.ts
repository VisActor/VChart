import type { IPieSeriesSpec, IPie3dSeriesSpec } from '../../series/pie/interface';
import type { IIndicatorSpec } from '../../component/indicator/interface';
import type { IChartExtendsSeriesSpec, IChartSpec } from '../../typings/spec/common';

export interface IPieChartSpec extends IChartSpec, IChartExtendsSeriesSpec<IPieSeriesSpec> {
  type: 'pie';
  /** 饼图指标卡 */
  indicator?: IIndicatorSpec | IIndicatorSpec[];
}

export interface IPie3dChartSpec extends IChartSpec, IChartExtendsSeriesSpec<IPie3dSeriesSpec> {
  type: 'pie3d';
  /** 饼图指标卡 */
  indicator?: IIndicatorSpec | IIndicatorSpec[];
}
