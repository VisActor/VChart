import type React from 'react';
import type { IPieChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerPieChart, registerLabel, registerIndicator } from '@visactor/vchart';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';
import { simpleComponentsRegisters } from './register';

export interface PieChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IPieChartSpec, 'type'> {}

export const PieChart = createChart<React.PropsWithChildren<PieChartProps> & { type: 'pie' }>(
  'PieChart',
  {
    type: 'pie',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerPieChart, registerLabel, registerIndicator, ...simpleComponentsRegisters]
);
