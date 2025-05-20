import type React from 'react';
import type { IWordCloud3dChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerWordCloud3dChart } from '@visactor/vchart';
import { registers } from './registers/simple';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';
import { registerWordCloud3dChart } from '@visactor/vchart-extension';
import type { IWordCloud3dChartSpec } from '@visactor/vchart-extension';

export interface WordCloud3dChartProps
  extends Omit<BaseChartProps, 'container' | 'type' | 'data'>,
    Omit<Partial<IWordCloud3dChartSpec>, 'type'> {}

export const WordCloud3dChart = createChart<React.PropsWithChildren<WordCloud3dChartProps> & { type?: 'wordCloud3d' }>(
  'WordCloud3dChart',
  {
    type: 'wordCloud3d',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerWordCloud3dChart, ...registers]
);
