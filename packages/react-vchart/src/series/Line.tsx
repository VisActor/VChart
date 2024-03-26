import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { ILineSeriesSpec } from '@visactor/vchart';
import { registerLineSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerLineSeries]);

export type LineProps = BaseSeriesProps & Omit<ILineSeriesSpec, 'type'>;

export const Line = createSeries<LineProps>('Line', ['line'], 'line');
