import React from 'react';
import { IWordCloudChartSpec } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface WordCloudChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IWordCloudChartSpec, 'type'> {}

export const WordCloudChart = createChart<React.PropsWithChildren<WordCloudChartProps>>('WordCloudChart', 'wordCloud');
