import type { IVChartConstructor, IPieChartSpec } from '@visactor/vchart';
import { VChart, registerPieChart, registerLabel, registerIndicator } from '@visactor/vchart';
import { createChart } from './generate-charts';
import { simpleComponentsRegisters } from './register';

export const PieChart = createChart<IPieChartSpec>(
  'PieChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerPieChart, registerLabel, registerIndicator, ...simpleComponentsRegisters]
);
