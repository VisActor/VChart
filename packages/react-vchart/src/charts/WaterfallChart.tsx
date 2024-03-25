import React from 'react';
import type { IWaterfallChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerWaterfallChart,
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
  registerWaterfallChart,
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

export interface WaterfallChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IWaterfallChartSpec, 'type'> {
  //
}

export const WaterfallChart = createChart<React.PropsWithChildren<WaterfallChartProps> & { type: 'waterfall' }>(
  'WaterfallChart',
  {
    type: 'waterfall',
    vchartConstrouctor: VChart as IVChartConstructor
  }
);
