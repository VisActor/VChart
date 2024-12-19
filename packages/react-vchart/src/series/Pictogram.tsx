import type { BaseSeriesProps } from './BaseSeries';
import { createSeries } from './BaseSeries';
import type { IPictogramSeriesSpec } from '@visactor/vchart';
import { registerPictogramSeries } from '@visactor/vchart';

export type PictogramProps = BaseSeriesProps & Omit<IPictogramSeriesSpec, 'type'>;

export const Pictogram = createSeries<PictogramProps>('Pictogram', ['pictogram'], 'pictogram', [
  registerPictogramSeries
]);
