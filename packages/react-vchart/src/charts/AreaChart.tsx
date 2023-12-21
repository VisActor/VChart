import React from 'react';
import type { IAreaChartSpec } from '@visactor/vchart';
import { default as VChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface AreaChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IAreaChartSpec, 'type'> {}

export const AreaChart = createChart<React.PropsWithChildren<AreaChartProps>>('AreaChart', {
  type: 'area',
  vchartConstrouctor: VChart
});
