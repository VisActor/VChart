import type { ICartesianAxisCommonSpec } from '../../component/axis/cartesian/interface';
import { CartesianChart } from '../cartesian/cartesian';
import type { IHistogramChartSpec } from './interface';

export class BaseHistogramChart<T extends IHistogramChartSpec> extends CartesianChart<T> {
  protected _canStack: boolean = true;

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
