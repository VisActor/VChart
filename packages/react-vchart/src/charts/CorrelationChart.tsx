import type React from 'react';
import type { ICorrelationChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerCorrelationChart } from '@visactor/vchart';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';
import { simpleComponentsRegisters } from './register';

export interface CorrelationChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<Partial<ICorrelationChartSpec>, 'type'> {}

export const CorrelationChart = createChart<React.PropsWithChildren<CorrelationChartProps> & { type?: 'correlation' }>(
  'CorrelationChart',
  {
    type: 'correlation',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerCorrelationChart, ...simpleComponentsRegisters]
);
