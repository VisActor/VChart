import React from 'react';
import { IFunnelChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerFunnelChart,
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerLabel,
  registerTitle,
  registerCustomMark
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([
  registerFunnelChart,
  registerDiscreteLegend,
  registerContinuousLegend,
  registerTooltip,
  registerDomTooltipHandler,
  registerCanvasTooltipHandler,
  registerLabel,
  registerTitle,
  registerCustomMark
]);

export interface FunnelChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IFunnelChartSpec, 'type'> {}

export const FunnelChart = createChart<React.PropsWithChildren<FunnelChartProps> & { type: 'funnel' }>('FunnelChart', {
  type: 'funnel',
  vchartConstrouctor: VChart as IVChartConstructor
});
