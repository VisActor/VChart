import React from 'react';
import type { IRangeColumnChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerHistogramChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis, // 非必选
  registerCartesianLogAxis, // 非必选
  registerCartesianCrossHair,
  registerScrollBar,
  registerLabel
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

VChart.useRegisters([
  registerHistogramChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis, // 非必选
  registerCartesianLogAxis, // 非必选
  registerCartesianCrossHair,
  registerScrollBar,
  registerLabel
]);

export interface RangeColumnChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IRangeColumnChartSpec, 'type'> {}

export const RangeColumnChart = createChart<React.PropsWithChildren<RangeColumnChartProps> & { type: 'rangeColumn' }>(
  'RangeColumnChart',
  {
    type: 'rangeColumn',
    vchartConstrouctor: VChart as IVChartConstructor
  }
);
