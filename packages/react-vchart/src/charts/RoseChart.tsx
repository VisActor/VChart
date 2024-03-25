import React from 'react';
import type { IRoseChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerRoseChart,
  registerPolarLinearAxis, // 必选
  registerPolarBandAxis, // 必选
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerPolarCrossHair,
  registerLabel,
  registerTitle,
  registerCustomMark
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([
  registerRoseChart,
  registerPolarLinearAxis, // 必选
  registerPolarBandAxis, // 必选
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerPolarCrossHair,
  registerLabel,
  registerTitle,
  registerCustomMark
]);

export interface RoseChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IRoseChartSpec, 'type'> {}

export const RoseChart = createChart<React.PropsWithChildren<RoseChartProps> & { type: 'rose' }>('RoseChart', {
  type: 'rose',
  vchartConstrouctor: VChart as IVChartConstructor
});
