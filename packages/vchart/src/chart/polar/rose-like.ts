import type { IPolarAxis } from '../../component/axis/polar/interface';
import { PolarChart } from './polar';

export class RoseLikeChart extends PolarChart {
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

  transformSpec(spec: any): void {
    super.transformSpec(spec);

    /* 处理 axis 配置 */
    if (this.needAxes()) {
      if (!spec.axes) {
        spec.axes = [];
      }
      const haxAxes = { radius: false, angle: false };
      (spec.axes ?? []).forEach((axis: IPolarAxis) => {
        const orient = axis.orient;
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
