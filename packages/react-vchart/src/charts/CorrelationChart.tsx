import React from 'react';
import { ICorrelationChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerCorrelationChart,
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
  registerCorrelationChart,
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerTitle,
  registerCustomMark
]);

export interface CorrelationChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<ICorrelationChartSpec, 'type'> {}

export const CorrelationChart = createChart<React.PropsWithChildren<CorrelationChartProps> & { type: 'correlation' }>(
  'CorrelationChart',
  {
    type: 'correlation',
    vchartConstrouctor: VChart as IVChartConstructor
  }
);
