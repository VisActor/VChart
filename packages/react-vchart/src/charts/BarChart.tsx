import React from 'react';
import type { IBarChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerBarChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis, // 非必选
  registerCartesianLogAxis, // 非必选
  registerCartesianCrossHair,
  registerLabel,
  registerTotalLabel
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([
  registerBarChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis, // 非必选
  registerCartesianLogAxis, // 非必选
  registerCartesianCrossHair,
  registerLabel,
  registerTotalLabel
]);

export interface BarChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IBarChartSpec, 'type'> {
  //
}

export const BarChart = createChart<React.PropsWithChildren<BarChartProps> & { type: 'bar' }>('BarChart', {
  type: 'bar',
  vchartConstrouctor: VChart as IVChartConstructor
});
