import React from 'react';
import type { IAreaChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerAreaChart,
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
  registerAreaChart,
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

export interface AreaChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IAreaChartSpec, 'type'> {}

export const AreaChart = createChart<React.PropsWithChildren<AreaChartProps> & { type: 'area' }>('AreaChart', {
  type: 'area',
  vchartConstrouctor: VChart as IVChartConstructor
});
