import { SeriesTypeEnum } from '../../series/interface/type';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface/type';
import { HeatmapSeries, registerHeatmapSeries } from '../../series/heatmap/heatmap';
import { Factory } from '../../core/factory';

export class HeatmapChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.heatmap;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.heatmap;
  readonly seriesType: string = SeriesTypeEnum.heatmap;

  protected _getDefaultSeriesSpec(spec: any): any {
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
