import React from 'react';
import type { IRoseChartSpec } from '@visactor/vchart';
import { VChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface RoseChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IRoseChartSpec, 'type'> {}

export const RoseChart = createChart<React.PropsWithChildren<RoseChartProps> & { type: 'rose' }>('RoseChart', {
  type: 'rose',
  vchartConstrouctor: VChart
});
