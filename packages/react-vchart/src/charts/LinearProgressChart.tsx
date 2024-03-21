import React from 'react';
import { ILinearProgressChartSpec } from '@visactor/vchart';
import { VChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface LinearProgressChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<ILinearProgressChartSpec, 'type'> {}

export const LinearProgressChart = createChart<
  React.PropsWithChildren<LinearProgressChartProps> & { type: 'linearProgress' }
>('LinearProgressChart', {
  type: 'linearProgress',
  vchartConstrouctor: VChart
});
