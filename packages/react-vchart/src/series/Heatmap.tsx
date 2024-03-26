import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { IHeatmapChartSpec } from '@visactor/vchart';
import { registerHeatmapSeries, VChart } from '@visactor/vchart';

VChart.useRegisters([registerHeatmapSeries]);

export type HeatmapProps = BaseSeriesProps & Omit<IHeatmapChartSpec, 'type'>;

export const Heatmap = createSeries<HeatmapProps>('Treemap', ['cell', 'cellBackground', 'label'], 'heatmap');
