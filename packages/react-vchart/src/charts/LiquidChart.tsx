import React from 'react';
import type { ILiquidChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerLiquidChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface LiquidChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data' | 'data'>,
    Omit<ILiquidChartSpec, 'type'> {}

export const LiquidChart = createChart<React.PropsWithChildren<LiquidChartProps> & { type: 'liquid' }>(
  'LiquidChart',
  {
    type: 'liquid',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerLiquidChart]
);
