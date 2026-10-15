import React from 'react';
import type { IVChartConstructor } from '@visactor/vchart';
import type { ISequenceChartSpec } from '@visactor/vchart-extension';
import { registerSequenceChart } from '@visactor/vchart-extension';
import { VChart } from '@visactor/vchart';
import { createChart } from './generate-charts';
import { registers } from './registers/cartesian';

export const SequenceChart = createChart<ISequenceChartSpec>(
  'SequenceChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerSequenceChart, ...registers]
);
