import React from 'react';
import { IFunnel3dChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerFunnel3dChart, registerLabel } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { simpleComponentsRegisters } from './register';

export interface Funnel3dChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IFunnel3dChartSpec, 'type'> {}

export const Funnel3dChart = createChart<React.PropsWithChildren<Funnel3dChartProps> & { type: 'funnel3d' }>(
  'Funnel3dChart',
  {
    type: 'funnel3d',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerFunnel3dChart, registerLabel, ...simpleComponentsRegisters]
);
