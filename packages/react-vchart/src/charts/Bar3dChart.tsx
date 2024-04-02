import React from 'react';
import type { IBar3dChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerBar3dChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis, // 非必选
  registerCartesianLogAxis, // 非必选
  registerCartesianCrossHair,
  registerLabel,
  registerTotalLabel
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface Bar3dChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IBar3dChartSpec, 'type'> {
  //
}

export const Bar3dChart = createChart<React.PropsWithChildren<Bar3dChartProps> & { type: 'bar3d' }>(
  'Bar3dChart',
  {
    type: 'bar3d',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [
    registerBar3dChart,
    registerCartesianLinearAxis,
    registerCartesianBandAxis,
    registerCartesianTimeAxis, // 非必选
    registerCartesianLogAxis, // 非必选
    registerCartesianCrossHair,
    registerLabel,
    registerTotalLabel,
    ...cartesianComponentsRegisters
  ]
);
