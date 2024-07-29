import type { IVChartConstructor, ICorrelationChartSpec } from '@visactor/vchart';
import { VChart, registerCorrelationChart } from '@visactor/vchart';
import { cartesianComponentsRegisters } from './register';
import { createChart } from './generate-charts';

export const CorrelationChart = createChart<ICorrelationChartSpec>(
  'CorrelationChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerCorrelationChart, ...cartesianComponentsRegisters]
);
