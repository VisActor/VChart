import type { IChartSpec } from '../../typings/spec/common';
import type { IPolarAxisSpec } from '../../component/axis/polar/interface';
import type { IGaugePointerSeriesSpec, IGaugeSeriesSpec } from '../../series/gauge';
import type { ILinearAxisSpec } from '../../component/axis/interface';
import type { ICircularProgressSeriesSpec } from '../../series/progress/circular/interface';

export interface IGaugeChartSpec extends IChartSpec, Omit<IGaugePointerSeriesSpec, 'data' | 'type' | 'morph'> {
  type: 'gauge';

  /** 表盘背景，可选择 gauge 系列或 circularProgress 系列的配置 */
  gauge?: Omit<IGaugeSeriesSpec, 'data'> | Omit<ICircularProgressSeriesSpec, 'data'>;

  /** 轴配置 */
  axes?: (IPolarAxisSpec | ILinearAxisSpec)[];
}
