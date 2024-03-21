import React from 'react';
import type { IRadarChartSpec } from '@visactor/vchart';
import { VChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface RadarChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IRadarChartSpec, 'type'> {}

export const RadarChart = createChart<React.PropsWithChildren<RadarChartProps> & { type: 'radar' }>('RadarChart', {
  type: 'radar',
  vchartConstrouctor: VChart
});
