import React from 'react';
import type { IScatterChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerScatterChart, registerLabel } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface ScatterChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IScatterChartSpec, 'type'> {}

export const ScatterChart = createChart<React.PropsWithChildren<ScatterChartProps> & { type: 'scatter' }>(
  'ScatterChart',
  {
    type: 'scatter',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerScatterChart, registerLabel, ...cartesianComponentsRegisters]
);
