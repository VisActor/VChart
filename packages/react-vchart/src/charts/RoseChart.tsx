import React from 'react';
import { IRoseChartSpec } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface RoseChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IRoseChartSpec, 'type'> {}

export const RoseChart = createChart<React.PropsWithChildren<RoseChartProps>>('RoseChart', 'rose');
