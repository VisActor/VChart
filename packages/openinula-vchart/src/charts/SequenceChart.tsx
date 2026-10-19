import React from 'openinula';
import type { ISequenceChartSpec } from '@visactor/vchart-extension';
import { registerSequenceChart } from '@visactor/vchart-extension';
import { default as VChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

registerSequenceChart({ VChart });

export interface SequenceChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<ISequenceChartSpec, 'type'> {}

export const SequenceChart = createChart<React.PropsWithChildren<SequenceChartProps> & { type: 'sequence' }>(
  'SequenceChart',
  {
    type: 'sequence',
    vchartConstructor: VChart
  }
);
