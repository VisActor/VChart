import { IBoxPlotChartSpec } from '@visactor/vchart';
import { BaseChartProps, createChart } from './BaseChart';

export interface BoxPlotChartProps
  extends Omit<BaseChartProps, 'spec' | 'container' | 'type'>,
    Omit<IBoxPlotChartSpec, 'type'> {}

export const BoxPlotChart = createChart<BoxPlotChartProps>('BoxPlotChart', 'boxPlot');
