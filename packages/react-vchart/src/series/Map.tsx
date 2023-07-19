import { BaseSeriesProps, createSeries } from './BaseSeries';
import { IMapSeriesSpec } from '@visactor/vchart';

export type MapProps = BaseSeriesProps & Omit<IMapSeriesSpec, 'type'>;

export const Map = createSeries<MapProps>('Map', ['map'], 'map');
