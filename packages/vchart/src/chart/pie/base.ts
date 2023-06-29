import { PolarChart } from '../polar/polar';

export class BasePieChart extends PolarChart {
  protected needAxes(): boolean {
    return false;
  }

  protected _getDefaultSeriesSpec(spec: any): any {
    return {
      ...super._getDefaultSeriesSpec(spec),

      // 兼容旧版写法
      categoryField: spec.categoryField || spec.seriesField,
      valueField: spec.valueField || spec.angleField,

      center: spec.center,
      centerOffset: spec.centerOffset,

      cornerRadius: spec.cornerRadius,

      padAngle: spec.padAngle
    };
  }
}
