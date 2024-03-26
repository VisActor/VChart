import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { ILinearProgressSeriesSpec } from '@visactor/vchart';
import { registerLinearProgressSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerLinearProgressSeries]);

export type LinearProgressProps = BaseSeriesProps & Omit<ILinearProgressSeriesSpec, 'type'>;

export const LinearProgress = createSeries<LinearProgressProps>('LinearProgress', ['linearProgress'], 'linearProgress');
