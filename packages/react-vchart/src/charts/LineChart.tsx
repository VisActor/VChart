import React from 'react';
import type { ILineChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerLineChart,
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
  registerTotalLabel,
  registerBrush,
  registerCustomMark
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([
  registerLineChart,
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
  registerTotalLabel,
  registerBrush,
  registerCustomMark
]);

export interface LineChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<ILineChartSpec, 'type'> {}

export const LineChart = createChart<React.PropsWithChildren<LineChartProps> & { type: 'line' }>('LineChart', {
  type: 'line',
  vchartConstrouctor: VChart as IVChartConstructor
});
