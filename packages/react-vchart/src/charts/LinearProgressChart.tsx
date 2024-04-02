import React from 'react';
import { ILinearProgressChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerLinearProgressChart, registerLabel } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface LinearProgressChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ILinearProgressChartSpec, 'type'> {}

export const LinearProgressChart = createChart<
  React.PropsWithChildren<LinearProgressChartProps> & { type: 'linearProgress' }
>(
  'LinearProgressChart',
  {
    type: 'linearProgress',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerLinearProgressChart, registerLabel, ...cartesianComponentsRegisters]
);
