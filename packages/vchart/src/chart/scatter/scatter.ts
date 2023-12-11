import { registerScatterSeries } from '../../series/scatter/scatter';
import { SeriesTypeEnum } from '../../series/interface/type';
import { CartesianChart, CartesianChartSpecTransformer } from '../cartesian/cartesian';
import { ChartTypeEnum } from '../interface/type';
import type { IScatterChartSpec } from './interface';
import { Factory } from '../../core/factory';

export class ScatterChartSpecTransformer<
  T extends IScatterChartSpec = IScatterChartSpec
> extends CartesianChartSpecTransformer<T> {
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

export class ScatterChart<T extends IScatterChartSpec = IScatterChartSpec> extends CartesianChart<T> {
  static readonly type: string = ChartTypeEnum.scatter;
  static readonly seriesType: string = SeriesTypeEnum.scatter;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = ScatterChartSpecTransformer;
  // @ts-ignore
  readonly transformerConstructor = ScatterChartSpecTransformer;
  readonly type: string = ChartTypeEnum.scatter;
  readonly seriesType: string = SeriesTypeEnum.scatter;
  protected _canStack: boolean = true;
}

export const registerScatterChart = () => {
  registerScatterSeries();
  Factory.registerChart(ScatterChart.type, ScatterChart);
};
