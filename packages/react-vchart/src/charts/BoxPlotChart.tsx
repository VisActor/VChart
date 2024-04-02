import React from 'react';
import { IBoxPlotChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerBoxplotChart, registerLabel } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface BoxPlotChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IBoxPlotChartSpec, 'type'> {}

export const BoxPlotChart = createChart<React.PropsWithChildren<BoxPlotChartProps> & { type: 'boxPlot' }>(
  'BoxPlotChart',
  {
    type: 'boxPlot',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerBoxplotChart, registerLabel, ...cartesianComponentsRegisters]
);
