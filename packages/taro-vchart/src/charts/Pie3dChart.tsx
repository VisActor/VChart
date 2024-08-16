import React from 'react';
import type { IPie3dChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerPie3dChart, registerLabel, registerIndicator } from '@visactor/vchart';
import { createChart } from './generate-charts';
import { registers } from './registers/simple';

export const Pie3dChart = createChart<IPie3dChartSpec>(
  'Pie3dChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerPie3dChart, registerLabel, registerIndicator, ...registers]
);
