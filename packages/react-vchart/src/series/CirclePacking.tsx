import { BaseSeriesProps, createSeries } from './BaseSeries';

import type { ICirclePackingSeriesSpec } from '@visactor/vchart';
import { registerCirclePackingSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerCirclePackingSeries]);

export type CirclePackingProps = BaseSeriesProps & Omit<ICirclePackingSeriesSpec, 'type'>;

export const CirclePacking = createSeries<CirclePackingProps>(
  'CirclePacking',
  ['circlePacking', 'label'],
  'circlePacking'
);
