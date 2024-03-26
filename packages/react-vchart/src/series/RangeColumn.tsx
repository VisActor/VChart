import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { IRangeColumnSeriesSpec } from '@visactor/vchart';
import { registerRangeColumnSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerRangeColumnSeries]);

export type RangeColumnProps = BaseSeriesProps & Omit<IRangeColumnSeriesSpec, 'type'>;

export const RangeColumn = createSeries<RangeColumnProps>('RangeColumn', ['rangeColumn'], 'rangeColumn');
