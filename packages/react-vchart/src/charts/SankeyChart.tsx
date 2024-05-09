import React from 'react';
import type { ISankeyChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerSankeyChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { simpleComponentsRegisters } from './register';

export interface SankeyChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ISankeyChartSpec, 'type'> {}

export const SankeyChart = createChart<React.PropsWithChildren<SankeyChartProps> & { type: 'sankey' }>(
  'SankeyChart',
  {
    type: 'sankey',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerSankeyChart, ...simpleComponentsRegisters]
);
