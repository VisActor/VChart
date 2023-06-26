import { SeriesTypeEnum } from '../../series/interface';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface';
import { VChart } from '../../core/vchart';
import { HeatmapSeries } from '../../series';
VChart.useSeries([HeatmapSeries]);

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
