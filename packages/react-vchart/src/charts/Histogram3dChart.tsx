import React from 'react';
import { IHistogram3dChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerHistogram3dChart, registerLabel } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface Histogram3dChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IHistogram3dChartSpec, 'type'> {}

export const Histogram3dChart = createChart<React.PropsWithChildren<Histogram3dChartProps> & { type: 'histogram3d' }>(
  'Histogram3dChart',
  {
    type: 'histogram3d',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerHistogram3dChart, registerLabel, ...cartesianComponentsRegisters]
);
