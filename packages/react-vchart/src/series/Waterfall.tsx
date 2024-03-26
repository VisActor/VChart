import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { IWaterfallSeriesSpec } from '@visactor/vchart';
import { registerWaterfallSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerWaterfallSeries]);

export type WaterfallProps = BaseSeriesProps & Omit<IWaterfallSeriesSpec, 'type'>;

export const Waterfall = createSeries<WaterfallProps>(
  'Waterfall',
  ['leaderLine', 'stackLabel', 'label', 'bar'],
  'waterfall'
);
