import type { IVChartConstructor, IBar3dChartSpec } from '@visactor/vchart';
import { VChart, registerBar3dChart, registerTotalLabel, registerLabel } from '@visactor/vchart';
import { cartesianComponentsRegisters } from './register';
import { createChart } from './generate-charts';

export const Bar3dChart = createChart<IBar3dChartSpec>(
  'Bar3dChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerBar3dChart, registerLabel, registerTotalLabel, ...cartesianComponentsRegisters]
);
