import React from 'react';
import { ICirclePackingChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerCirclePackingChart,
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
  registerCirclePackingChart,
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerTitle,
  registerCustomMark
]);

export interface CirclePackingChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ICirclePackingChartSpec, 'type'> {}

export const CirclePackingChart = createChart<
  React.PropsWithChildren<CirclePackingChartProps> & { type: 'circlePacking' }
>('CirclePackingChart', {
  type: 'circlePacking',
  vchartConstrouctor: VChart as IVChartConstructor
});
