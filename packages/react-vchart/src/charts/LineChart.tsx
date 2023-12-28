import React from 'react';
import type { ILineChartSpec } from '@visactor/vchart';
import { default as VChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface LineChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<ILineChartSpec, 'type'> {}

export const LineChart = createChart<React.PropsWithChildren<LineChartProps> & { type: 'line' }>('LineChart', {
  type: 'line',
  vchartConstrouctor: VChart
});
