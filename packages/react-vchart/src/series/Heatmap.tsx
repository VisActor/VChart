import { BaseSeriesProps, createSeries } from './BaseSeries';
import type { IHeatmapChartSpec } from '@visactor/vchart';
import { registerHeatmapSeries } from '@visactor/vchart';

export type HeatmapProps = BaseSeriesProps & Omit<IHeatmapChartSpec, 'type'>;

export const Heatmap = createSeries<HeatmapProps>('Treemap', ['cell', 'cellBackground', 'label'], 'heatmap', [
  registerHeatmapSeries
]);
