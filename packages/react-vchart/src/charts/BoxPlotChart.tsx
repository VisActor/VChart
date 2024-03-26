import React from 'react';
import { IBoxPlotChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerBoxplotChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis, // 非必选
  registerCartesianLogAxis, // 非必选
  registerCartesianCrossHair,
  registerLabel
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface BoxPlotChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IBoxPlotChartSpec, 'type'> {}

export const BoxPlotChart = createChart<React.PropsWithChildren<BoxPlotChartProps> & { type: 'boxPlot' }>(
  'BoxPlotChart',
  {
    type: 'boxPlot',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [
    registerBoxplotChart,
    registerCartesianLinearAxis,
    registerCartesianBandAxis,
    registerCartesianTimeAxis, // 非必选
    registerCartesianLogAxis, // 非必选
    registerCartesianCrossHair,
    registerLabel
  ]
);
