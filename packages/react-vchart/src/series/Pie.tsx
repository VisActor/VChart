import { BaseSeriesProps, createSeries } from './BaseSeries';
import { IPieSeriesSpec } from '@visactor/vchart';

export type PieProps = BaseSeriesProps & Omit<IPieSeriesSpec, 'type'>;

export const Pie = createSeries<PieProps>('Pie', ['pie'], 'pie');
