import { BaseSeriesProps, createSeries } from './BaseSeries';

import type { IBarSeriesSpec } from '@visactor/vchart';
import { registerBarSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerBarSeries]);

export type BarProps = BaseSeriesProps & Omit<IBarSeriesSpec, 'type'>;

export const Bar = createSeries<BarProps>('Bar', ['bar'], 'bar');
