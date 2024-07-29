import React from 'react';
import type { IWordCloud3dChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerWordCloud3dChart } from '@visactor/vchart';
import { createChart } from './generate-charts';
import { simpleComponentsRegisters } from './register';

export const WordCloud3dChart = createChart<IWordCloud3dChartSpec>(
  'WordCloud3dChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerWordCloud3dChart, ...simpleComponentsRegisters]
);
