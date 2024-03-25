import React from 'react';
import type { ITreemapChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerTreemapChart,
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
  registerTreemapChart,
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerTitle,
  registerCustomMark
]);

export interface TreemapChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ITreemapChartSpec, 'type'> {}

export const TreemapChart = createChart<React.PropsWithChildren<TreemapChartProps> & { type: 'treemap' }>(
  'TreemapChart',
  {
    type: 'treemap',
    vchartConstrouctor: VChart as IVChartConstructor
  }
);