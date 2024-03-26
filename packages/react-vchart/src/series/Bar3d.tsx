import { BaseSeriesProps, createSeries } from './BaseSeries';

import type { IBar3dSeriesSpec } from '@visactor/vchart';
import { registerBar3dSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerBar3dSeries]);

export type Bar3dProps = BaseSeriesProps & Omit<IBar3dSeriesSpec, 'type'>;

export const Bar3d = createSeries<Bar3dProps>('Bar3d', ['bar'], 'bar3d');
