import React from 'react';
import { IVChartConstructor, IHistogramChartSpec } from '@visactor/vchart';
import { VChart, registerHistogramChart, registerLabel } from '@visactor/vchart';
import { createChart } from './generate-charts';
import { cartesianComponentsRegisters } from './register';

export const HistogramChart = createChart<IHistogramChartSpec>(
  'HistogramChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerHistogramChart, registerLabel, ...cartesianComponentsRegisters]
);
