import type React from 'react';
import type { IHistogram3dChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerHistogram3dChart, registerLabel } from '@visactor/vchart';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';
import { registers } from './registers/cartesian';

export interface Histogram3dChartProps
  extends Omit<BaseChartProps, 'container' | 'type' | 'data'>,
    Omit<Partial<IHistogram3dChartSpec>, 'type'> {}

export const Histogram3dChart = createChart<React.PropsWithChildren<Histogram3dChartProps> & { type?: 'histogram3d' }>(
  'Histogram3dChart',
  {
    type: 'histogram3d',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerHistogram3dChart, registerLabel, ...registers]
);
