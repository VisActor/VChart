import type React from 'react';
import type { IFunnel3dChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerFunnel3dChart, registerLabel } from '@visactor/vchart';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';
import { simpleComponentsRegisters } from './register';

export interface Funnel3dChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<Partial<IFunnel3dChartSpec>, 'type'> {}

export const Funnel3dChart = createChart<React.PropsWithChildren<Funnel3dChartProps> & { type?: 'funnel3d' }>(
  'Funnel3dChart',
  {
    type: 'funnel3d',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerFunnel3dChart, registerLabel, ...simpleComponentsRegisters]
);
