import React from 'react';
import { IBoxPlotChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerBoxplotChart,
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
  registerDataZoom,
  registerScrollBar,
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
  registerBoxplotChart,
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
  registerDataZoom,
  registerScrollBar,
  registerLabel,
  registerTitle,
  registerMarkLine,
  registerMarkPoint,
  registerMarkArea,
  registerBrush,
  registerCustomMark
]);

export interface BoxPlotChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IBoxPlotChartSpec, 'type'> {}

export const BoxPlotChart = createChart<React.PropsWithChildren<BoxPlotChartProps> & { type: 'boxPlot' }>(
  'BoxPlotChart',
  {
    type: 'boxPlot',
    vchartConstrouctor: VChart as IVChartConstructor
  }
);
