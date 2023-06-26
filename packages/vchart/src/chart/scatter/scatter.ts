import { SeriesTypeEnum } from '../../series/interface';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface';
import type { IScatterChartSpec } from './interface';
import { VChart } from '../../core/vchart';
import { ScatterSeries } from '../../series';
VChart.useSeries([ScatterSeries]);

export class ScatterChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.scatter;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.scatter;
  readonly seriesType: string = SeriesTypeEnum.scatter;

  protected _getDefaultSeriesSpec(spec: IScatterChartSpec): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      point: spec.point,
      size: spec.size,
      sizeField: spec.sizeField,
      shape: spec.shape,
      shapeField: spec.shapeField
    };
  }
}
