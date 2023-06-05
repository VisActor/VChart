import { IFunnelChartSpec } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface FunnelChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IFunnelChartSpec, 'type'> {}

export const FunnelChart = createChart<FunnelChartProps>('FunnelChart', 'funnel');
