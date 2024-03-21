import React from 'react';
import { ICircularProgressChartSpec } from '@visactor/vchart';
import { VChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface CircularProgressChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<ICircularProgressChartSpec, 'type'> {}

export const CircularProgressChart = createChart<
  React.PropsWithChildren<CircularProgressChartProps> & { type: 'circularProgress' }
>('CircularProgressChart', {
  type: 'circularProgress',
  vchartConstrouctor: VChart
});
