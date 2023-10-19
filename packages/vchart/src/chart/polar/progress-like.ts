import { isNil } from '@visactor/vutils';
import type { IPolarAxisSpec, IPolarBandAxisSpec, IPolarLinearAxisSpec } from '../../component/axis/polar/interface';
import { getLinearAxisSpecDomain } from '../../component/axis/util';
import { PolarChart } from './polar';
import { mergeSpec } from '../../util';

export class ProgressLikeChart extends PolarChart {
  protected needAxes(): boolean {
    return false;
  }

  protected _getDefaultSeriesSpec(spec: any): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),

      seriesField: spec.seriesField,
      categoryField: spec.categoryField || spec.radiusField,
      valueField: spec.valueField || spec.angleField,

      startAngle: spec.startAngle,
      endAngle: spec.endAngle,

      radius: spec.radius,
      innerRadius: spec.innerRadius,

      centerX: spec.centerX,
      centerY: spec.centerY
    };
    return series;
  }

  protected _transformProgressAxisSpec(
    spec: any,
    angleAxisDefaultSpec: IPolarAxisSpec,
    radiusAxisDefaultSpec: IPolarAxisSpec,
    angleAxisAppendSpec?: Partial<IPolarAxisSpec>,
    radiusAxisAppendSpec?: Partial<IPolarAxisSpec>
  ): void {
    if (!spec.axes) {
      spec.axes = [];
    }
    const axesPtr: {
      radius: IPolarBandAxisSpec | null;
      angle: IPolarLinearAxisSpec | null;
    } = { radius: null, angle: null };
    (spec.axes ?? []).forEach((axis: IPolarAxisSpec) => {
      const { orient } = axis;
      if (orient === 'radius') {
        axesPtr.radius = axis;
      }
      if (orient === 'angle') {
        axesPtr.angle = axis;
      }
    });
    if (!axesPtr.angle) {
      axesPtr.angle = angleAxisDefaultSpec;
      spec.axes.push(axesPtr.angle);
    }
    if (!axesPtr.radius) {
      axesPtr.radius = radiusAxisDefaultSpec;
      spec.axes.push(axesPtr.radius);
    }

    // 自动补充缺失的配置
    if (isNil(axesPtr.angle.type)) {
      axesPtr.angle.type = 'linear';
    }
    if (isNil(axesPtr.radius.type)) {
      axesPtr.radius.type = 'band';
    }
    const domain = getLinearAxisSpecDomain(axesPtr.angle, { min: 0, max: 1 });
    if (isNil(axesPtr.angle.min)) {
      axesPtr.angle.min = domain.min;
    }
    if (isNil(axesPtr.angle.max)) {
      axesPtr.angle.max = domain.max;
    }
    if (angleAxisAppendSpec) {
      const newSpec = mergeSpec({}, angleAxisAppendSpec, axesPtr.angle);
      Object.assign(axesPtr.angle, newSpec);
    }
    if (radiusAxisAppendSpec) {
      const newSpec = mergeSpec({}, radiusAxisAppendSpec, axesPtr.radius);
      Object.assign(axesPtr.radius, newSpec);
    }
  }
}
