import type { IVChartConstructor, IBoxPlotChartSpec } from '@visactor/vchart';
import { VChart, registerBoxplotChart, registerLabel } from '@visactor/vchart';
import { cartesianComponentsRegisters } from './register';
import { createChart } from './generate-charts';

export const BoxPlotChart = createChart<IBoxPlotChartSpec>(
  'BoxPlotChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerBoxplotChart, registerLabel, ...cartesianComponentsRegisters]
);
