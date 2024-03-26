import React from 'react';
import type { IPie3dChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerPie3dChart, registerLabel } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([registerPie3dChart, registerLabel]);

export interface Pie3dChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IPie3dChartSpec, 'type'> {}

export const Pie3dChart = createChart<React.PropsWithChildren<Pie3dChartProps> & { type: 'pie3d' }>('Pie3dChart', {
  type: 'pie3d',
  vchartConstrouctor: VChart as IVChartConstructor
});
