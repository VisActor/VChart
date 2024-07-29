import type { IVChartConstructor, IAreaChartSpec } from '@visactor/vchart';
import { VChart, registerAreaChart, registerLabel } from '@visactor/vchart';
import { cartesianComponentsRegisters } from './register';
import { createChart } from './generate-charts';

export const AreaChart = createChart<IAreaChartSpec>(
  'AreaChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerAreaChart, registerLabel, ...cartesianComponentsRegisters]
);
