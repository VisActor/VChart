import React from 'react';
import { ILinearProgressChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerLinearProgressChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis, // 非必选
  registerCartesianLogAxis, // 非必选
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerCartesianCrossHair,
  registerLabel,
  registerTitle,
  registerMarkLine,
  registerMarkPoint,
  registerMarkArea,
  registerBrush,
  registerCustomMark
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([
  registerLinearProgressChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis, // 非必选
  registerCartesianLogAxis, // 非必选
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerCartesianCrossHair,
  registerLabel,
  registerTitle,
  registerMarkLine,
  registerMarkPoint,
  registerMarkArea,
  registerBrush,
  registerCustomMark
]);

export interface LinearProgressChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ILinearProgressChartSpec, 'type'> {}

export const LinearProgressChart = createChart<
  React.PropsWithChildren<LinearProgressChartProps> & { type: 'linearProgress' }
>('LinearProgressChart', {
  type: 'linearProgress',
  vchartConstrouctor: VChart as IVChartConstructor
});
