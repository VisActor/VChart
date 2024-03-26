import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { IMapSeriesSpec } from '@visactor/vchart';
import { registerMapSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerMapSeries]);

export type MapProps = BaseSeriesProps & Omit<IMapSeriesSpec, 'type'>;

export const Map = createSeries<MapProps>('Map', ['map'], 'map');
