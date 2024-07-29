import React from 'react';
import type { IVChartConstructor, ILiquidChartSpec } from '@visactor/vchart';
import { VChart, registerLiquidChart } from '@visactor/vchart';
import { createChart } from './generate-charts';
import { simpleComponentsRegisters } from './register';

export const LiquidChart = createChart<ILiquidChartSpec>(
  'LiquidChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerLiquidChart, ...simpleComponentsRegisters]
);
