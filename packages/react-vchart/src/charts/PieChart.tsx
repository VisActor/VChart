import React from 'react';
import type { IPieChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerPieChart,
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerLabel,
  registerTitle,
  registerCustomMark,
  registerIndicator
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([
  registerPieChart,
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerLabel,
  registerTitle,
  registerCustomMark,
  registerIndicator
]);

export interface PieChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IPieChartSpec, 'type'> {}

export const PieChart = createChart<React.PropsWithChildren<PieChartProps> & { type: 'pie' }>('PieChart', {
  type: 'pie',
  vchartConstrouctor: VChart as IVChartConstructor
});
