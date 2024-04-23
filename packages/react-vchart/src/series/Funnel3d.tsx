import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { IFunnel3dSeriesSpec } from '@visactor/vchart';
import { registerFunnel3dSeries } from '@visactor/vchart';

export type Funnel3dProps = BaseSeriesProps & Omit<IFunnel3dSeriesSpec, 'type'>;

export const Funnel3d = createSeries<Funnel3dProps>('Funnel3d', ['funnel'], 'funnel3d', [registerFunnel3dSeries]);
