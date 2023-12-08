import type { IPolarAxisSpec } from '../../component/axis/polar/interface';
import type { IPolarChartSpec } from './interface';
import { PolarChart } from './polar';

export class RoseLikeChart<T extends IPolarChartSpec> extends PolarChart<T> {
  protected _canStack: boolean = true;
  protected needAxes(): boolean {
    return true;
  }

  protected _getDefaultSeriesSpec(spec: any): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),

      // 兼容旧版写法
      categoryField: spec.categoryField || spec.angleField,
      valueField: spec.valueField || spec.radiusField
    };
    return series;
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);

    // set default config for axis
    if (this.needAxes()) {
      if (!spec.axes) {
        spec.axes = [];
      }
      const haxAxes = { radius: false, angle: false };
      (spec.axes ?? []).forEach((axis: IPolarAxisSpec) => {
        const { orient } = axis;
        if (orient === 'radius') {
          haxAxes.radius = true;
        }
        if (orient === 'angle') {
          haxAxes.angle = true;
        }
      });
      if (!haxAxes.angle) {
        spec.axes.push({
          orient: 'angle'
        });
      }
      if (!haxAxes.radius) {
        spec.axes.push({
          orient: 'radius'
        });
      }
    }
  }
}
