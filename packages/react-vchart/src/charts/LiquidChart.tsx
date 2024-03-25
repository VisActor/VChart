import React from 'react';
import type { ILiquidChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerLiquidChart,
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerTitle,
  registerCustomMark
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([
  registerLiquidChart,
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerTitle,
  registerCustomMark
]);

export interface LiquidChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data' | 'data'>,
    Omit<ILiquidChartSpec, 'type'> {}

export const LiquidChart = createChart<React.PropsWithChildren<LiquidChartProps> & { type: 'liquid' }>('LiquidChart', {
  type: 'liquid',
  vchartConstrouctor: VChart as IVChartConstructor
});
