import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { ICircularProgressSeriesSpec } from '@visactor/vchart';
import { registerCircularProgressSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerCircularProgressSeries]);

export type CircularProgressProps = BaseSeriesProps & Omit<ICircularProgressSeriesSpec, 'type'>;

export const CircularProgress = createSeries<CircularProgressProps>(
  'CircularProgress',
  ['circularProgress'],
  'circularProgress'
);
