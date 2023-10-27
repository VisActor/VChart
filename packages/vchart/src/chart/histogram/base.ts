import type { ICartesianAxisCommonSpec } from '../../component/axis/cartesian/interface';
import { CartesianChart } from '../cartesian/cartesian';

export class BaseHistogramChart extends CartesianChart {
  protected _canStack: boolean = true;

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    spec.axes.forEach((axis: ICartesianAxisCommonSpec) => (axis.type = 'linear'));
  }

  protected _getDefaultSeriesSpec(spec: any): any {
    return {
      ...super._getDefaultSeriesSpec(spec),
      x2Field: spec?.x2Field,
      y2Field: spec?.y2Field,
      barMinHeight: spec?.barMinHeight
    };
  }
}
