import { BaseSeriesProps, createSeries } from './BaseSeries';

import type { ISunburstSeriesSpec } from '@visactor/vchart';
import { registerSunBurstSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerSunBurstSeries]);

export type SunburstProps = BaseSeriesProps & Omit<ISunburstSeriesSpec, 'type'>;

export const Sunburst = createSeries<SunburstProps>('Sunburst', ['sunburst', 'label'], 'sunburst');
