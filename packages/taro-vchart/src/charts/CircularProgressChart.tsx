import type { IVChartConstructor, ICircularProgressChartSpec } from '@visactor/vchart';
import { VChart, registerCircularProgressChart, registerLabel, registerIndicator } from '@visactor/vchart';
import { cartesianComponentsRegisters } from './register';
import { createChart } from './generate-charts';

export const CircularProgressChart = createChart<ICircularProgressChartSpec>(
  'CircularProgressChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerCircularProgressChart, registerLabel, registerIndicator, ...cartesianComponentsRegisters]
);
