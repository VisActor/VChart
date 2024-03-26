import React from 'react';
import type { IRadarChartSpec, IVChartConstructor } from '@visactor/vchart';
import {
  VChart,
  registerRadarChart,
  registerPolarLinearAxis, // 必选
  registerPolarBandAxis, // 必选
  registerPolarCrossHair,
  registerLabel
} from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface RadarChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type' | 'data'>,
    Omit<IRadarChartSpec, 'type'> {}

export const RadarChart = createChart<React.PropsWithChildren<RadarChartProps> & { type: 'radar' }>(
  'RadarChart',
  {
    type: 'radar',
    vchartConstrouctor: VChart as IVChartConstructor
  },
  [
    registerRadarChart,
    registerPolarLinearAxis, // 必选
    registerPolarBandAxis, // 必选
    registerPolarCrossHair,
    registerLabel
  ]
);
