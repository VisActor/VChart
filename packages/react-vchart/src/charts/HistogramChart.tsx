import { IHistogramChartSpec } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface HistogramChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IHistogramChartSpec, 'type'> {}

export const HistogramChart = createChart<HistogramChartProps>('HistogramChart', 'histogram');
