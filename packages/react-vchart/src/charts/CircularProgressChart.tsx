import React from 'react';
import { ICircularProgressChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerCircularProgressChart, registerLabel } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { polarComponentsRegisters } from './register';

export interface CircularProgressChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ICircularProgressChartSpec, 'type'> {}

export const CircularProgressChart = createChart<
  React.PropsWithChildren<CircularProgressChartProps> & { type: 'circularProgress' }
>(
  'CircularProgressChart',
  {
    type: 'circularProgress',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerCircularProgressChart, registerLabel, ...polarComponentsRegisters]
);
