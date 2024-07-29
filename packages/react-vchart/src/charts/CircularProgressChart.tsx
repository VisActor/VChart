import type React from 'react';
import type { ICircularProgressChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerCircularProgressChart, registerLabel, registerIndicator } from '@visactor/vchart';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';
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
  [registerCircularProgressChart, registerLabel, registerIndicator, ...polarComponentsRegisters]
);
