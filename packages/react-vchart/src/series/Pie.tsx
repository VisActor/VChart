import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { IPieSeriesSpec } from '@visactor/vchart';
import { registerPieSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerPieSeries]);

export type PieProps = BaseSeriesProps & Omit<IPieSeriesSpec, 'type'>;

export const Pie = createSeries<PieProps>('Pie', ['pie'], 'pie');
