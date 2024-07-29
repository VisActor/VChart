import React from 'react';
import type { IRangeColumnChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerRangeColumnChart, registerLabel } from '@visactor/vchart';
import { createChart } from './generate-charts';
import { cartesianComponentsRegisters } from './register';

export const RangeColumnChart = createChart<IRangeColumnChartSpec>(
  'RangeColumnChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerRangeColumnChart, registerLabel, ...cartesianComponentsRegisters]
);
