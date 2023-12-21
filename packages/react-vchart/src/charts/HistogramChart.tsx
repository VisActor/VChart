import React from 'react';
import { IHistogramChartSpec } from '@visactor/vchart';
import { default as VChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface HistogramChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IHistogramChartSpec, 'type'> {}

export const HistogramChart = createChart<React.PropsWithChildren<HistogramChartProps>>('HistogramChart', {
  type: 'histogram',
  vchartConstrouctor: VChart
});
