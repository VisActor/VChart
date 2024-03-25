import { BaseSeriesProps, createSeries } from './BaseSeries';

import type { IGaugeSeriesSpec } from '@visactor/vchart';

export type GaugeProps = BaseSeriesProps & Omit<IGaugeSeriesSpec, 'type'>;

export const Gauge = createSeries<GaugeProps>('Sankey', ['segment', 'track', 'label'], 'gauge');
