import { ILinearProgressChartSpec } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface LinearProgressChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<ILinearProgressChartSpec, 'type'> {}

export const LinearProgressChart = createChart<LinearProgressChartProps>('LinearProgressChart', 'linearProgress');
