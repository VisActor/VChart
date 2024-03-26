import { BaseSeriesProps, createSeries } from './BaseSeries';

import type { IGaugeSeriesSpec } from '@visactor/vchart';
import { registerGaugeSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerGaugeSeries]);

export type GaugeProps = BaseSeriesProps & Omit<IGaugeSeriesSpec, 'type'>;

export const Gauge = createSeries<GaugeProps>('Sankey', ['segment', 'track', 'label'], 'gauge');
