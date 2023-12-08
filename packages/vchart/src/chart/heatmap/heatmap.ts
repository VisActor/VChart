import { SeriesTypeEnum } from '../../series/interface/type';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface/type';
import { registerHeatmapSeries } from '../../series/heatmap/heatmap';
import { Factory } from '../../core/factory';
import type { IHeatmapChartSpec } from './interface';

export class HeatmapChart<T extends IHeatmapChartSpec = IHeatmapChartSpec> extends CartesianChart<T> {
  static readonly type: string = ChartTypeEnum.heatmap;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.heatmap;
  readonly seriesType: string = SeriesTypeEnum.heatmap;

  protected _getDefaultSeriesSpec(spec: T): any {
    const series = super._getDefaultSeriesSpec(spec);
    return {
      ...series,
      valueField: spec.valueField,
      cell: spec.cell
    };
  }
}

export const registerHeatmapChart = () => {
  registerHeatmapSeries();
  Factory.registerChart(HeatmapChart.type, HeatmapChart);
};
