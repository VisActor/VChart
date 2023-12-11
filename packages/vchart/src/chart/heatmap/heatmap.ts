import { SeriesTypeEnum } from '../../series/interface/type';
import { CartesianChart, CartesianChartSpecTransformer } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface/type';
import { registerHeatmapSeries } from '../../series/heatmap/heatmap';
import { Factory } from '../../core/factory';
import type { IHeatmapChartSpec } from './interface';

export class HeatmapChartSpecTransformer<
  T extends IHeatmapChartSpec = IHeatmapChartSpec
> extends CartesianChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
    const series = super._getDefaultSeriesSpec(spec);
    return {
      ...series,
      valueField: spec.valueField,
      cell: spec.cell
    };
  }
}

export class HeatmapChart<T extends IHeatmapChartSpec = IHeatmapChartSpec> extends CartesianChart<T> {
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
