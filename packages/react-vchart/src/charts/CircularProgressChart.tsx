import React from 'react';
import { ICircularProgressChartSpec } from '@visactor/vchart';
import { default as VChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface CircularProgressChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<ICircularProgressChartSpec, 'type'> {}

export const CircularProgressChart = createChart<React.PropsWithChildren<CircularProgressChartProps>>(
  'CircularProgressChart',
  {
    type: 'circularProgress',
    vchartConstrouctor: VChart
  }
);
