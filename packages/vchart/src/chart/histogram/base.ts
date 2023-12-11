import type { ICartesianAxisCommonSpec } from '../../component/axis/cartesian/interface';
import { CartesianChart, CartesianChartSpecTransformer } from '../cartesian/cartesian';
import type { IHistogramChartSpec } from './interface';

export class BaseHistogramChartSpecTransformer<T extends IHistogramChartSpec> extends CartesianChartSpecTransformer<T> {
  transformSpec(spec: T): void {
    super.transformSpec(spec);
    spec.axes.forEach((axis: ICartesianAxisCommonSpec) => (axis.type = 'linear'));
  }

  protected _getDefaultSeriesSpec(spec: T): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      x2Field: spec?.x2Field,
      y2Field: spec?.y2Field,
      barMinHeight: spec?.barMinHeight
    };
  }
}

export class BaseHistogramChart<T extends IHistogramChartSpec> extends CartesianChart<T> {
  static readonly transformerConstructor = BaseHistogramChartSpecTransformer;
  readonly transformerConstructor = BaseHistogramChartSpecTransformer;
  protected _canStack: boolean = true;
}
