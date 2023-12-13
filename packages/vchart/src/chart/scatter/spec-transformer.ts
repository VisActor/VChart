import { CartesianChartSpecTransformer } from '../cartesian';
import type { IScatterChartSpec } from './interface';

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
