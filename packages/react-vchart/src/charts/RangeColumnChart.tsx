import React from 'react';
import { IRangeColumnChartSpec } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface RangeColumnChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IRangeColumnChartSpec, 'type'> {}

export const RangeColumnChart = createChart<React.PropsWithChildren<RangeColumnChartProps>>(
  'RangeColumnChart',
  'rangeColumn'
);
