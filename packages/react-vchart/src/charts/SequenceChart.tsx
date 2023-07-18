import React from 'react';
import { ISequenceChartSpec } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface SequenceChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<ISequenceChartSpec, 'type'> {}

export const SequenceChart = createChart<React.PropsWithChildren<SequenceChartProps>>('SequenceChart', 'sequence');
