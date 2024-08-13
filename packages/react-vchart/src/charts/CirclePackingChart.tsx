import type React from 'react';
import type { ICirclePackingChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerCirclePackingChart } from '@visactor/vchart';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';
import { simpleComponentsRegisters } from './register';

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
  [registerCirclePackingChart, ...simpleComponentsRegisters]
);
