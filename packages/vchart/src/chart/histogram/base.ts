import type { ICartesianAxisCommonSpec } from '../../component/axis/cartesian/interface';
import { CartesianChart } from '../cartesian/cartesian';
import type { IChartOption } from '../interface/common';
import { Stack } from '../stack';

export class BaseHistogramChart extends CartesianChart {
  constructor(spec: any, option: IChartOption) {
    super(spec, option);

    this._stack = new Stack(this);
  }

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
