import type { IVChartConstructor, IBarChartSpec } from '@visactor/vchart';
import { VChart, registerBarChart, registerTotalLabel, registerLabel } from '@visactor/vchart';
import { cartesianComponentsRegisters } from './register';
import { createChart } from './generate-charts';

export const BarChart = createChart<IBarChartSpec>(
  'BarChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerBarChart, registerLabel, registerTotalLabel, ...cartesianComponentsRegisters]
);
