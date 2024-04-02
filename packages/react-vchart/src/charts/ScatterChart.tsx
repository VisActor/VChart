import React from 'react';
import type { IScatterChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerScatterChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis, // 非必选
  registerCartesianLogAxis, // 非必选
  registerCartesianCrossHair,
  registerLabel
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface ScatterChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IScatterChartSpec, 'type'> {}

export const ScatterChart = createChart<React.PropsWithChildren<ScatterChartProps> & { type: 'scatter' }>(
  'ScatterChart',
  {
    type: 'scatter',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [
    registerScatterChart,
    registerCartesianLinearAxis,
    registerCartesianBandAxis,
    registerCartesianTimeAxis, // 非必选
    registerCartesianLogAxis, // 非必选
    registerCartesianCrossHair,
    registerLabel,
    ...cartesianComponentsRegisters
  ]
);
