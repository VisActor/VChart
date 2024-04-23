import { ComponentTypeEnum } from '../../interface/type';
import { polarLayout } from '../utils';
import { registerMarkPointAnimate } from '@visactor/vrender-components';
import { Factory } from '../../../core/factory';
import { BaseMarkPoint } from './base-mark-point';
import type { IPolarSeries } from 'src/series';
import type { IMarkProcessOptions } from '../interface';

export class PolarMarkPoint extends BaseMarkPoint {
  static type = ComponentTypeEnum.polarMarkPoint;
  type = ComponentTypeEnum.polarMarkPoint;
  name: string = ComponentTypeEnum.polarMarkPoint;
  static coordinateType = 'polar';
  coordinateType = 'polar';

  protected _computePointsAttr() {
    const data = this._markerData;
    const relativeSeries = this._relativeSeries;
    const autoRange = this._spec?.autoRange ?? false;
    const polarPoint = polarLayout(data, relativeSeries, relativeSeries, relativeSeries, autoRange)[0][0];
    const center = {
      x:
        this._relativeSeries.getRegion().getLayoutStartPoint().x +
        (this._relativeSeries as IPolarSeries).angleAxisHelper.center().x,
      y:
        this._relativeSeries.getRegion().getLayoutStartPoint().y +
        (this._relativeSeries as IPolarSeries).angleAxisHelper.center().y
    };
    const point = {
      x: center.x + polarPoint.radius * Math.cos(polarPoint.angle),
      y: center.y + polarPoint.radius * Math.sin(polarPoint.angle)
    };

    return { point };
  }

  protected _computeOptions(): IMarkProcessOptions {
    const spec = this._spec as any;
    const options = [this._processSpecAngRad(spec.angle, spec.radius)];
    return { options };
  }
}

export const registerPolarMarkPoint = () => {
  Factory.registerComponent(PolarMarkPoint.type, PolarMarkPoint);
  registerMarkPointAnimate();
};
