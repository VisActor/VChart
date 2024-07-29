import React from 'react';
import type { IPie3dChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerPie3dChart, registerLabel } from '@visactor/vchart';
import { createChart } from './generate-charts';
import { simpleComponentsRegisters } from './register';

export const Pie3dChart = createChart<IPie3dChartSpec>(
  'Pie3dChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerPie3dChart, registerLabel, ...simpleComponentsRegisters]
);
