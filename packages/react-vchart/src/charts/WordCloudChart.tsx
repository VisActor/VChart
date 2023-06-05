import { IWordCloudChartSpec } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface WordCloudChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IWordCloudChartSpec, 'type'> {}

export const WordCloudChart = createChart<WordCloudChartProps>('WordCloudChart', 'wordCloud');
