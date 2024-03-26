import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { IPie3dSeriesSpec } from '@visactor/vchart';
import { registerPie3dSeries } from '@visactor/vchart';

export type Pie3dProps = BaseSeriesProps & Omit<IPie3dSeriesSpec, 'type'>;

export const Pie3d = createSeries<Pie3dProps>('Pie3d', ['pie'], 'pie3d', [registerPie3dSeries]);
