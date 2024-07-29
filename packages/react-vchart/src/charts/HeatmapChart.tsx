import type React from 'react';
import type { IHeatmapChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerHeatmapChart, registerLabel } from '@visactor/vchart';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface HeatmapChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IHeatmapChartSpec, 'type'> {
  //
}

export const HeatmapChart = createChart<React.PropsWithChildren<HeatmapChartProps> & { type: 'heatmap' }>(
  'HeatmapChart',
  {
    type: 'heatmap',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerHeatmapChart, registerLabel, ...cartesianComponentsRegisters]
);
