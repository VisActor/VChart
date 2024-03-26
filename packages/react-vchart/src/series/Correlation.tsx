import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { ICorrelationSeriesSpec } from '@visactor/vchart';
import { registerCorrelationChart, VChart } from '@visactor/vchart';

VChart.useRegisters([registerCorrelationChart]);

export type CorrelationProps = BaseSeriesProps & Omit<ICorrelationSeriesSpec, 'type'>;

export const Correlation = createSeries<CorrelationProps>(
  'Correlation',
  ['centerPoint', 'ripplePoint', 'centerLabel', 'nodePoint', 'label'],
  'correlation'
);
