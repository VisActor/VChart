import React from 'react';
import type { ISunburstChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerSunburstChart } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { simpleComponentsRegisters } from './register';

export interface SunburstChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ISunburstChartSpec, 'type'> {}

export const SunburstChart = createChart<React.PropsWithChildren<SunburstChartProps> & { type: 'sunburst' }>(
  'SunburstChart',
  {
    type: 'sunburst',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerSunburstChart, ...simpleComponentsRegisters]
);
