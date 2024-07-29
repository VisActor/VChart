import React from 'react';
import { ILinearProgressChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerLinearProgressChart, registerLabel } from '@visactor/vchart';
import { createChart } from './generate-charts';
import { cartesianComponentsRegisters } from './register';

export const LinearProgressChart = createChart<ILinearProgressChartSpec>(
  'LinearProgressChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerLinearProgressChart, registerLabel, ...cartesianComponentsRegisters]
);
