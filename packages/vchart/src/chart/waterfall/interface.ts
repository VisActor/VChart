import type { IWaterfallSeriesSpec } from '../../series/waterfall/interface';
import type { IChartExtendsSeriesSpec } from '../../typings/spec';
import type { IBarChartSpec } from '../bar/interface';

export interface IWaterfallChartSpec
  extends Omit<IBarChartSpec, 'type' | 'label' | 'series'>,
    IChartExtendsSeriesSpec<IWaterfallSeriesSpec> {
  type: 'waterfall';
  /** 系列配置 */
  series?: IWaterfallSeriesSpec[];
}
