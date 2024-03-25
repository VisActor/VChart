import React from 'react';
import { ICircularProgressChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerCircularProgressChart,
  registerPolarLinearAxis, // 必选
  registerPolarBandAxis, // 必选
  registerPolarCrossHair,
  registerLabel
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([
  registerCircularProgressChart,
  registerPolarLinearAxis, // 必选
  registerPolarBandAxis, // 必选
  registerPolarCrossHair,
  registerLabel
]);

export interface CircularProgressChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ICircularProgressChartSpec, 'type'> {}

export const CircularProgressChart = createChart<
  React.PropsWithChildren<CircularProgressChartProps> & { type: 'circularProgress' }
>('CircularProgressChart', {
  type: 'circularProgress',
  vchartConstrouctor: VChart as IVChartConstructor
});
