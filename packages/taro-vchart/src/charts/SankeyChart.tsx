import React from 'react';
import type { ISankeyChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerSankeyChart } from '@visactor/vchart';
import { createChart } from './generate-charts';
import { simpleComponentsRegisters } from './register';

export const SankeyChart = createChart<ISankeyChartSpec>(
  'SankeyChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerSankeyChart, ...simpleComponentsRegisters]
);
