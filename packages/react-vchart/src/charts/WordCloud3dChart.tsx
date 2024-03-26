import React from 'react';
import type { IWordCloud3dChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerWordCloud3dChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([registerWordCloud3dChart]);

export interface WordCloud3dChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IWordCloud3dChartSpec, 'type'> {}

export const WordCloud3dChart = createChart<React.PropsWithChildren<WordCloud3dChartProps> & { type: 'wordCloud3d' }>(
  'WordCloud3dChart',
  {
    type: 'wordCloud3d',
    vchartConstrouctor: VChart as IVChartConstructor
  }
);
