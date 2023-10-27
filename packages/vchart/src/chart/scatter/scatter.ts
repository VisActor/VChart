import { registerScatterSeries } from '../../series/scatter/scatter';
import { SeriesTypeEnum } from '../../series/interface';
import { CartesianChart } from '../cartesian/cartesian';
import type { IChartOption } from '../interface';
import { ChartTypeEnum } from '../interface';
import type { IScatterChartSpec } from './interface';
import { Factory } from '../../core/factory';
import { Stack } from '../stack';

export class ScatterChart extends CartesianChart {
  static readonly type: string = ChartTypeEnum.scatter;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.scatter;
  readonly seriesType: string = SeriesTypeEnum.scatter;

  constructor(spec: any, option: IChartOption) {
    super(spec, option);

    this._stack = new Stack(this);
  }

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
