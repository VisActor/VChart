import React from 'react';
import { IFunnelChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerFunnelChart, registerLabel } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([registerFunnelChart, registerLabel]);

export interface FunnelChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IFunnelChartSpec, 'type'> {}

export const FunnelChart = createChart<React.PropsWithChildren<FunnelChartProps> & { type: 'funnel' }>('FunnelChart', {
  type: 'funnel',
  vchartConstrouctor: VChart as IVChartConstructor
});
