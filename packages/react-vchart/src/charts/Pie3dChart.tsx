import type React from 'react';
import type { IPie3dChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerPie3dChart, registerIndicator, registerLabel } from '@visactor/vchart';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';
import { registers } from './registers/simple';

export interface Pie3dChartProps
  extends Omit<BaseChartProps, 'container' | 'type' | 'data'>,
    Omit<Partial<IPie3dChartSpec>, 'type'> {}

export const Pie3dChart = createChart<React.PropsWithChildren<Pie3dChartProps> & { type?: 'pie3d' }>(
  'Pie3dChart',
  {
    type: 'pie3d',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerPie3dChart, registerLabel, registerIndicator, ...registers]
);
