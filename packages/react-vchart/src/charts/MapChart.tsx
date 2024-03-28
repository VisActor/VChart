import React from 'react';
import type { IMapChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerMapChart, registerLabel } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface MapChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IMapChartSpec, 'type'> {}

export const MapChart = createChart<React.PropsWithChildren<MapChartProps> & { type: 'map' }>(
  'MapChart',
  {
    type: 'map',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerMapChart, registerLabel]
);
