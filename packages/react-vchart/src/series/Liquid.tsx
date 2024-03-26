import { BaseSeriesProps, createSeries } from './BaseSeries';

import type { ILiquidSeriesSpec } from '@visactor/vchart';
import { registerLiquidSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerLiquidSeries]);

export type LiquidProps = BaseSeriesProps & Omit<ILiquidSeriesSpec, 'type'>;

export const Liquid = createSeries<LiquidProps>('Liquid', ['node', 'link'], 'liquid');
