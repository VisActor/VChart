import type React from 'react';
import type { IPictogramChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerPictogramChart, registerLabel } from '@visactor/vchart';
import { registers } from './registers/simple';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';

export interface PictogramChartProps
  extends Omit<BaseChartProps, 'container' | 'type' | 'data'>,
    Omit<Partial<IPictogramChartSpec>, 'type'> {}

export const PictogramChart = createChart<React.PropsWithChildren<PictogramChartProps> & { type?: 'pictogram' }>(
  'PictogramChart',
  {
    type: 'pictogram',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerPictogramChart, registerLabel, ...registers]
);
