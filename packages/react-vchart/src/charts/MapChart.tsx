import React from 'react';
import type { IMapChartSpec } from '@visactor/vchart';
import { default as VChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface MapChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IMapChartSpec, 'type'> {}

export const MapChart = createChart<React.PropsWithChildren<MapChartProps>>('MapChart', {
  type: 'map',
  vchartConstrouctor: VChart
});
