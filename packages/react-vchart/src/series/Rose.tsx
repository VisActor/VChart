import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { IRoseSeriesSpec } from '@visactor/vchart';
import { registerRoseSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerRoseSeries]);

export type RoseProps = BaseSeriesProps & Omit<IRoseSeriesSpec, 'type'>;

export const Rose = createSeries<RoseProps>('Rose', ['rose'], 'rose');
