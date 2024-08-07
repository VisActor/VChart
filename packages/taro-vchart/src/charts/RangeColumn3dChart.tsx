import React from 'react';
import type { IRangeColumn3dChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerRangeColumn3dChart, registerLabel } from '@visactor/vchart';
import { createChart } from './generate-charts';
import { registers } from './registers/cartesian';

export const RangeColumn3dChart = createChart<IRangeColumn3dChartSpec>(
  'RangeColumn3dChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerRangeColumn3dChart, registerLabel, ...registers]
);
