import type { AdaptiveSpec } from '../..';
import { PolarChart, PolarChartSpecTransformer } from '../polar/polar';
import type { IPieChartSpec } from './interface';

export class BasePieChartSpecTransformer<T extends IPieChartSpec> extends PolarChartSpecTransformer<
  AdaptiveSpec<T, 'axes'>
> {
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

      padAngle: spec.padAngle,
      minAngle: spec.minAngle
    };
  }
}

export class BasePieChart<T extends IPieChartSpec> extends PolarChart<AdaptiveSpec<T, 'axes'>> {
  static readonly transformerConstructor = BasePieChartSpecTransformer;
  // @ts-ignore
  readonly transformerConstructor = BasePieChartSpecTransformer;
}
