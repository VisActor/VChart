import React from 'react';
import type { IScatterChartSpec } from '@visactor/vchart';
import { VChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface ScatterChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IScatterChartSpec, 'type'> {}

export const ScatterChart = createChart<React.PropsWithChildren<ScatterChartProps> & { type: 'scatter' }>(
  'ScatterChart',
  {
    type: 'scatter',
    vchartConstrouctor: VChart
  }
);
