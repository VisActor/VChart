import React from 'react';
import type { IScatterChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerScatterChart, registerLabel } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { registers } from './registers/cartesian';

export interface ScatterChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IScatterChartSpec, 'type'> {}

export const ScatterChart = createChart<React.PropsWithChildren<ScatterChartProps> & { type: 'scatter' }>(
  'ScatterChart',
  {
    type: 'scatter',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerScatterChart, registerLabel, ...registers]
);
