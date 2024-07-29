import type { IVChartConstructor, IHeatmapChartSpec } from '@visactor/vchart';
import {
  VChart,
  registerHeatmapChart,
  registerCartesianBandAxis,
  registerCartesianCrossHair,
  registerLabel
} from '@visactor/vchart';
import { createChart } from './generate-charts';
import { cartesianComponentsRegisters } from './register';

export const HeatmapChart = createChart<IHeatmapChartSpec>(
  'HeatmapChart',
  {
    chartConstructor: VChart as IVChartConstructor
  },
  [registerHeatmapChart, registerLabel, ...cartesianComponentsRegisters]
);
