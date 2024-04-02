import React from 'react';
import type { ILineChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerLineChart, registerLabel, registerTotalLabel } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface LineChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ILineChartSpec, 'type'> {}

export const LineChart = createChart<React.PropsWithChildren<LineChartProps> & { type: 'line' }>(
  'LineChart',
  {
    type: 'line',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerLineChart, registerLabel, registerTotalLabel, ...cartesianComponentsRegisters]
);
