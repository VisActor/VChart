import { IMapChartSpec } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface MapChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IMapChartSpec, 'type'> {}

export const MapChart = createChart<MapChartProps>('MapChart', 'map');
