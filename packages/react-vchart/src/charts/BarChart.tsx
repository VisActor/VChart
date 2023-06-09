import { IBarChartSpec } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface BarChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IBarChartSpec, 'type'> {
  //
}

export const BarChart = createChart<BarChartProps>('BarChart', 'bar');
