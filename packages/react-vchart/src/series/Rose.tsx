import { BaseSeriesProps, createSeries } from './BaseSeries';
import { IRoseSeriesSpec } from '@visactor/vchart';

export type RoseProps = BaseSeriesProps & Omit<IRoseSeriesSpec, 'type'>;

export const Rose = createSeries<RoseProps>('Rose', ['rose'], 'rose');
