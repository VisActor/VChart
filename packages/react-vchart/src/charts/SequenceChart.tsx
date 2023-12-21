import React from 'react';
import type { ISequenceChartSpec } from '@visactor/vchart';
import { default as VChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface SequenceChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<ISequenceChartSpec, 'type'> {}

export const SequenceChart = createChart<React.PropsWithChildren<SequenceChartProps>>('SequenceChart', {
  type: 'sequence',
  vchartConstrouctor: VChart
});
