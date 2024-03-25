import React from 'react';
import type { ISequenceChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerSequenceChart,
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
  registerTitle,
  registerMarkLine,
  registerMarkPoint,
  registerMarkArea,
  registerBrush,
  registerCustomMark
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([
  registerSequenceChart,
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
  registerTitle,
  registerMarkLine,
  registerMarkPoint,
  registerMarkArea,
  registerBrush,
  registerCustomMark
]);

export interface SequenceChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ISequenceChartSpec, 'type'> {}

export const SequenceChart = createChart<React.PropsWithChildren<SequenceChartProps> & { type: 'sequence' }>(
  'SequenceChart',
  {
    type: 'sequence',
    vchartConstrouctor: VChart as IVChartConstructor
  }
);
