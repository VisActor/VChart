import { BaseSeriesProps, createSeries } from './BaseSeries';
import { IFunnelSeriesSpec } from '@visactor/vchart';

export type FunnelProps = BaseSeriesProps & Omit<IFunnelSeriesSpec, 'type'>;

export const Funnel = createSeries<FunnelProps>('Funnel', ['funnel'], 'funnel');
