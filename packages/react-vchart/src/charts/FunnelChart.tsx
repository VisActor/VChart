import React from 'react';
import { IFunnelChartSpec } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface FunnelChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IFunnelChartSpec, 'type'> {}

export const FunnelChart = createChart<React.PropsWithChildren<FunnelChartProps>>('FunnelChart', 'funnel');
