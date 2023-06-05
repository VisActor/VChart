import { isValid } from '@visactor/vutils';
import { SeriesTypeEnum } from '../../series/interface';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface';

export class HeatmapChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.heatmap;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.heatmap;
  readonly seriesType: string = SeriesTypeEnum.heatmap;

  protected _getDefaultSeriesSpec(spec: any): any {
    const series = super._getDefaultSeriesSpec(spec);
    if (isValid(spec.valueField)) {
      series.valueField = spec.valueField;
    }
    return series;
  }
}
