import React from 'react';
import type { ISequenceChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerSequenceChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface SequenceChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ISequenceChartSpec, 'type'> {}

export const SequenceChart = createChart<React.PropsWithChildren<SequenceChartProps> & { type: 'sequence' }>(
  'SequenceChart',
  {
    type: 'sequence',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerSequenceChart, ...cartesianComponentsRegisters]
);
