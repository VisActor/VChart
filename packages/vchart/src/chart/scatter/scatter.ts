import { registerScatterSeries } from '../../series/scatter/scatter';
import { SeriesTypeEnum } from '../../series/interface/type';
import { CartesianChart } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface/type';
import type { IScatterChartSpec } from './interface';
import { Factory } from '../../core/factory';

export class ScatterChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.scatter;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.scatter;
  readonly seriesType: string = SeriesTypeEnum.scatter;
  protected _canStack: boolean = true;

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

export const registerScatterChart = () => {
  registerScatterSeries();
  Factory.registerChart(ScatterChart.type, ScatterChart);
};
