import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { IPie3dSeriesSpec } from '@visactor/vchart';
import { registerPie3dSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerPie3dSeries]);

export type Pie3dProps = BaseSeriesProps & Omit<IPie3dSeriesSpec, 'type'>;

export const Pie3d = createSeries<Pie3dProps>('Pie3d', ['pie'], 'pie3d');
