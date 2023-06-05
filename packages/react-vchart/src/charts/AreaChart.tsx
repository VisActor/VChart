import { IAreaChartSpec } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface AreaChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IAreaChartSpec, 'type'> {}

export const AreaChart = createChart<AreaChartProps>('AreaChart', 'area');
