import React from 'react';
import { ICommonChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerCommonChart,
  registerCartesianLinearAxis,
  registerCartesianBandAxis,
  registerCartesianTimeAxis, // 非必选
  registerCartesianLogAxis, // 非必选
  registerCartesianCrossHair,
  registerLabel,
  registerTotalLabel,
  registerAreaSeries,
  registerBarSeries,
  registerLineSeries,
  registerScatterSeries,
  registerPieSeries
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface CommonChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<ICommonChartSpec, 'type'> {}

export const CommonChart = createChart<React.PropsWithChildren<CommonChartProps> & { type: 'common' }>(
  'CommonChart',
  {
    type: 'common',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [
    registerCommonChart,
    registerCartesianLinearAxis,
    registerCartesianBandAxis,
    registerCartesianTimeAxis, // 非必选
    registerCartesianLogAxis, // 非必选
    registerCartesianCrossHair,

    registerLabel,
    registerTotalLabel,

    registerAreaSeries,
    registerBarSeries,
    registerLineSeries,
    registerScatterSeries,
    registerPieSeries
  ]
);
