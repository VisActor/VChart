import React from 'react';
import { ICirclePackingChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerCirclePackingChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([registerCirclePackingChart]);

export interface CirclePackingChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ICirclePackingChartSpec, 'type'> {}

export const CirclePackingChart = createChart<
  React.PropsWithChildren<CirclePackingChartProps> & { type: 'circlePacking' }
>('CirclePackingChart', {
  type: 'circlePacking',
  vchartConstrouctor: VChart as IVChartConstructor
});
