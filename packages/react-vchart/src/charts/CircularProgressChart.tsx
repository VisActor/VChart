import { ICircularProgressChartSpec } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface CircularProgressChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<ICircularProgressChartSpec, 'type'> {}

export const CircularProgressChart = createChart<CircularProgressChartProps>(
  'CircularProgressChart',
  'circularProgress'
);
