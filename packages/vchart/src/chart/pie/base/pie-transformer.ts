import type { AdaptiveSpec } from '../../../typings';
import { PolarChartSpecTransformer } from '../../polar';
import type { IPieChartSpec } from '../interface';

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
      minAngle: spec.minAngle,

      emptyPlaceholder: spec.emptyPlaceholder,
      emptyCircle: spec.emptyPlaceholder?.emptyCircle
    };
  }
}
