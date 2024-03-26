import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { IBoxPlotSeriesSpec } from '@visactor/vchart';
import { registerBoxplotSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerBoxplotSeries]);

export type BoxPlotProps = BaseSeriesProps & Omit<IBoxPlotSeriesSpec, 'type'>;

export const BoxPlot = createSeries<BoxPlotProps>('BoxPlot', ['boxPlot'], 'boxPlot');
