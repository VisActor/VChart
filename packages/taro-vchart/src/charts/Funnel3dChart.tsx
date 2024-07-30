import { IVChartConstructor, IFunnel3dChartSpec } from '@visactor/vchart';
import { VChart, registerFunnel3dChart, registerLabel } from '@visactor/vchart';
import { createChart } from './generate-charts';
import { registers } from './registers/simple';

export const Funnel3dChart = createChart<IFunnel3dChartSpec>(
  'Funnel3dChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerFunnel3dChart, registerLabel, ...registers]
);
