import type React from 'react';
import type { IVChartConstructor } from '@visactor/vchart';
import type { ISequenceChartSpec } from '@visactor/vchart-extension';
import { registerSequenceChart } from '@visactor/vchart-extension';
import { VChart } from '@visactor/vchart';
import { registers } from './registers/cartesian';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';

export interface SequenceChartProps
  extends Omit<BaseChartProps, 'container' | 'type' | 'data'>,
    Omit<Partial<ISequenceChartSpec>, 'type'> {}

export const SequenceChart = createChart<React.PropsWithChildren<SequenceChartProps> & { type?: 'sequence' }>(
  'SequenceChart',
  {
    type: 'sequence',
    vchartConstructor: VChart as IVChartConstructor
  },
  [registerSequenceChart, ...registers]
);
