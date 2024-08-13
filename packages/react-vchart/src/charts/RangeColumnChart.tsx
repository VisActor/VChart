import type React from 'react';
import type { IRangeColumnChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerRangeColumnChart, registerLabel } from '@visactor/vchart';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface RangeColumnChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<Partial<IRangeColumnChartSpec>, 'type'> {}

export const RangeColumnChart = createChart<React.PropsWithChildren<RangeColumnChartProps> & { type?: 'rangeColumn' }>(
  'RangeColumnChart',
  {
    type: 'rangeColumn',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerRangeColumnChart, registerLabel, ...cartesianComponentsRegisters]
);
