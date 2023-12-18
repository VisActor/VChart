import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import { registerHeatmapSeries } from '../../series/heatmap/heatmap';
import { Factory } from '../../core/factory';
import type { IHeatmapChartSpec } from './interface';
import { HeatmapChartSpecTransformer } from './heatmap-transformer';
import { BaseChart } from '../base';

export class HeatmapChart<T extends IHeatmapChartSpec = IHeatmapChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.heatmap;
  static readonly seriesType: string = SeriesTypeEnum.heatmap;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = HeatmapChartSpecTransformer;
  readonly transformerConstructor = HeatmapChartSpecTransformer;
  readonly type: string = ChartTypeEnum.heatmap;
  readonly seriesType: string = SeriesTypeEnum.heatmap;
}

export const registerHeatmapChart = () => {
  registerHeatmapSeries();
  Factory.registerChart(HeatmapChart.type, HeatmapChart);
};
