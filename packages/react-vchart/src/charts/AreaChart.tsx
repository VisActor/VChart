import React from 'react';
import type { IAreaChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerAreaChart, registerLabel } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface AreaChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IAreaChartSpec, 'type'> {}

export const AreaChart = createChart<React.PropsWithChildren<AreaChartProps> & { type: 'area' }>(
  'AreaChart',
  {
    type: 'area',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [
    registerAreaChart,
    registerCartesianLinearAxis,
    registerCartesianBandAxis,
    registerCartesianTimeAxis, // 非必选
    registerCartesianLogAxis, // 非必选
    registerCartesianCrossHair,
    registerLabel,

    ...cartesianComponentsRegisters
  ]
);
