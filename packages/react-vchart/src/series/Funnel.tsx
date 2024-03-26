import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { IFunnelSeriesSpec } from '@visactor/vchart';
import { registerFunnelSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerFunnelSeries]);

export type FunnelProps = BaseSeriesProps & Omit<IFunnelSeriesSpec, 'type'>;

export const Funnel = createSeries<FunnelProps>('Funnel', ['funnel'], 'funnel');
