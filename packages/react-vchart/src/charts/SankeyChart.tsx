import React from 'react';
import type { ISankeyChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerSankeyChart,
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
  registerSankeyChart,
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerTitle,
  registerCustomMark
]);

export interface SankeyChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ISankeyChartSpec, 'type'> {}

export const SankeyChart = createChart<React.PropsWithChildren<SankeyChartProps> & { type: 'sankey' }>('SankeyChart', {
  type: 'sankey',
  vchartConstrouctor: VChart as IVChartConstructor
});
