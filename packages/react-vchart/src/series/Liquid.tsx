import { BaseSeriesProps, createSeries } from './BaseSeries';

import type { ILiquidSeriesSpec } from '@visactor/vchart';

export type LiquidProps = BaseSeriesProps & Omit<ILiquidSeriesSpec, 'type'>;

export const Liquid = createSeries<LiquidProps>('Liquid', ['node', 'link'], 'liquid');
