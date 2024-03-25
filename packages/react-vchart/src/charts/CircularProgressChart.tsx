import React from 'react';
import { ICircularProgressChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerCircularProgressChart,
  registerPolarLinearAxis, // 必选
  registerPolarBandAxis, // 必选
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerPolarCrossHair,
  registerLabel,
  registerTitle,
  registerCustomMark,
  registerIndicator
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([
  registerCircularProgressChart,
  registerPolarLinearAxis, // 必选
  registerPolarBandAxis, // 必选
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerPolarCrossHair,
  registerLabel,
  registerTitle,
  registerCustomMark,
  registerIndicator
]);

export interface CircularProgressChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<ICircularProgressChartSpec, 'type'> {}

export const CircularProgressChart = createChart<
  React.PropsWithChildren<CircularProgressChartProps> & { type: 'circularProgress' }
>('CircularProgressChart', {
  type: 'circularProgress',
  vchartConstrouctor: VChart as IVChartConstructor
});
