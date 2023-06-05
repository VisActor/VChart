import { ILineChartSpec } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface LineChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<ILineChartSpec, 'type'> {}

export const LineChart = createChart<LineChartProps>('LineChart', 'line');
