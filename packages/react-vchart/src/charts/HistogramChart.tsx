import React from 'react';
import { IHistogramChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerHistogramChart, registerLabel } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface HistogramChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IHistogramChartSpec, 'type'> {}

export const HistogramChart = createChart<React.PropsWithChildren<HistogramChartProps> & { type: 'histogram' }>(
  'HistogramChart',
  {
    type: 'histogram',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerHistogramChart, registerLabel, ...cartesianComponentsRegisters]
);
