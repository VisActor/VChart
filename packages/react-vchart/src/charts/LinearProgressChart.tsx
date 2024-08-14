import type React from 'react';
import type { ILinearProgressChartSpec, IVChartConstructor } from '@visactor/vchart';
import { VChart, registerLinearProgressChart, registerLabel } from '@visactor/vchart';
import type { BaseChartProps } from './BaseChart';
import { createChart } from './BaseChart';
import { cartesianComponentsRegisters } from './register';

export interface LinearProgressChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<Partial<ILinearProgressChartSpec>, 'type'> {}

export const LinearProgressChart = createChart<
  React.PropsWithChildren<LinearProgressChartProps> & { type?: 'linearProgress' }
>(
  'LinearProgressChart',
  {
    type: 'linearProgress',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [registerLinearProgressChart, registerLabel, ...cartesianComponentsRegisters]
);
