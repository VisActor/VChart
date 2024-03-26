import React from 'react';
import { IHistogram3dChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerHistogram3dChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis, // 非必选
  registerCartesianLogAxis, // 非必选
  registerCartesianCrossHair,
  registerLabel
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface Histogram3dChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IHistogram3dChartSpec, 'type'> {}

export const Histogram3dChart = createChart<React.PropsWithChildren<Histogram3dChartProps> & { type: 'histogram3d' }>(
  'Histogram3dChart',
  {
    type: 'histogram3d',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [
    registerHistogram3dChart,
    registerCartesianLinearAxis,
    registerCartesianBandAxis,
    registerCartesianTimeAxis, // 非必选
    registerCartesianLogAxis, // 非必选
    registerCartesianCrossHair,
    registerLabel
  ]
);
