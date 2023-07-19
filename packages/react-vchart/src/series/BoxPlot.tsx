import { BaseSeriesProps, createSeries } from './BaseSeries';
import { IBoxPlotSeriesSpec } from '@visactor/vchart';

export type BoxPlotProps = BaseSeriesProps & Omit<IBoxPlotSeriesSpec, 'type'>;

export const BoxPlot = createSeries<BoxPlotProps>('BoxPlot', ['boxPlot'], 'boxPlot');
