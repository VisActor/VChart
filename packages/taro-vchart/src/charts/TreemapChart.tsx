import React from 'react';
import type { ITreemapChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerTreemapChart } from '@visactor/vchart';
import { createChart } from './generate-charts';
import { simpleComponentsRegisters } from './register';

export const TreemapChart = createChart<ITreemapChartSpec>(
  'TreemapChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerTreemapChart, ...simpleComponentsRegisters]
);
