import React from 'react';
import type { IRangeColumn3dChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerRangeColumn3dChart, registerLabel } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface RangeColumn3dChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IRangeColumn3dChartSpec, 'type'> {}

export const RangeColumn3dChart = createChart<
  React.PropsWithChildren<RangeColumn3dChartProps> & { type: 'rangeColumn3d' }
>(
  'RangeColumn3dChart',
  {
    type: 'rangeColumn3d',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerRangeColumn3dChart, registerLabel, ...cartesianComponentsRegisters]
);
