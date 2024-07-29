import React from 'react';
import type { IRadarChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerRadarChart, registerLabel } from '@visactor/vchart';
import { createChart } from './generate-charts';
import { polarComponentsRegisters } from './register';

export const RadarChart = createChart<IRadarChartSpec>(
  'RadarChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerRadarChart, registerLabel, ...polarComponentsRegisters]
);
