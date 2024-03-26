import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { IFunnel3dSeriesSpec } from '@visactor/vchart';
import { registerFunnel3dSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerFunnel3dSeries]);

export type Funnel3dProps = BaseSeriesProps & Omit<IFunnel3dSeriesSpec, 'type'>;

export const Funnel3d = createSeries<Funnel3dProps>('Funnel3d', ['funnel'], 'funnel3d');
