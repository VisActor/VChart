import type { IChartExtendsSeriesSpec, IChartSpec, ICartesianAxisSpec } from '@visactor/vchart';
import type { IEventSeriesSpec } from './series/interface';

export type TimelineLayoutType = 'horizontal' | 'vertical' | 'radial' | 's-curve';

export interface ITimelineChartSpec
  extends IChartSpec,
    Omit<IChartExtendsSeriesSpec<IEventSeriesSpec>, 'type' | 'title'> {
  type: 'timeline';
  layoutType?: TimelineLayoutType;
  series?: IEventSeriesSpec[];
  axes?: ICartesianAxisSpec[];
}
