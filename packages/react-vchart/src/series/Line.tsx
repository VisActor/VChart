import { BaseSeriesProps, createSeries } from './BaseSeries';
import { ILineSeriesSpec } from '@visactor/vchart';

export type LineProps = BaseSeriesProps & Omit<ILineSeriesSpec, 'type'>;

export const Line = createSeries<LineProps>('Line', ['line'], 'line');
