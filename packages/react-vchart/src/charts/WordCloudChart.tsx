import React from 'react';
import type { IWordCloudChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerWordCloudChart,
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerTitle,
  registerBrush,
  registerCustomMark
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([
  registerWordCloudChart,
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerTitle,
  registerBrush,
  registerCustomMark
]);

export interface WordCloudChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IWordCloudChartSpec, 'type'> {}

export const WordCloudChart = createChart<React.PropsWithChildren<WordCloudChartProps> & { type: 'wordCloud' }>(
  'WordCloudChart',
  {
    type: 'wordCloud',
    vchartConstrouctor: VChart as IVChartConstructor
  }
);
