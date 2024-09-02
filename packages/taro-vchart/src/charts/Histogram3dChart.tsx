import React from 'react';
import { IVChartConstructor, IHistogram3dChartSpec } from '@visactor/vchart';
import { VChart, registerHistogram3dChart, registerLabel } from '@visactor/vchart';
import { createChart } from './generate-charts';
import { registers } from './registers/cartesian';

export const Histogram3dChart = createChart<IHistogram3dChartSpec>(
  'Histogram3dChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerHistogram3dChart, registerLabel, ...registers]
);
