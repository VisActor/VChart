import type React from 'react';
import type { ICirclePackingChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerCirclePackingChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { registers } from './registers/simple';

export interface CirclePackingChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<Partial<ICirclePackingChartSpec>, 'type'> {}

export const CirclePackingChart = createChart<
  React.PropsWithChildren<CirclePackingChartProps> & { type?: 'circlePacking' }
>(
  'CirclePackingChart',
  {
    type: 'circlePacking',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerCirclePackingChart, ...registers]
);
