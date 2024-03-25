import React from 'react';
import type { IHeatmapChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerHeatmapChart,
  registerCartesianBandAxis,
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
  registerHeatmapChart,
  registerCartesianBandAxis,
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

export interface HeatmapChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IHeatmapChartSpec, 'type'> {
  //
}

export const HeatmapChart = createChart<React.PropsWithChildren<HeatmapChartProps> & { type: 'heatmap' }>(
  'HeatmapChart',
  {
    type: 'heatmap',
    vchartConstrouctor: VChart as IVChartConstructor
  }
);
