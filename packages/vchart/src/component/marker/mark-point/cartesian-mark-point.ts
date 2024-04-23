import type { IMarkPointCoordinateSpec } from './interface';
import { ComponentTypeEnum } from '../../interface/type';
import type { IOptionAggr } from '../../../data/transforms/aggregation';
import { cartesianCoordinateLayout, getMarkPointProcessInfo, positionLayout, xyLayout } from '../utils';
import { registerMarkPointAnimate } from '@visactor/vrender-components';
import { isValid } from '@visactor/vutils';
import { Factory } from '../../../core/factory';
import type { IPoint } from '../../../typings';
import { BaseMarkPoint } from './base-mark-point';
import type { IMarkProcessOptions } from '../interface';

export class CartesianMarkPoint extends BaseMarkPoint {
  static type = ComponentTypeEnum.cartesianMarkPoint;
  type = ComponentTypeEnum.cartesianMarkPoint;
  name: string = ComponentTypeEnum.cartesianMarkPoint;
  static coordinateType = 'cartesian';
  coordinateType = 'cartesian';

  protected _computePointsAttr() {
    const spec = this._spec;
    const data = this._markerData;
    const relativeSeries = this._relativeSeries;
    const isXYLayout = 'x' in spec && 'y' in spec;
    const isCoordinateLayout = 'coordinate' in spec;
    const isPositionLayout = 'position' in spec;
    const autoRange = spec?.autoRange ?? false;

    let point: IPoint;

    if (isXYLayout) {
      point = xyLayout(data, relativeSeries, relativeSeries, relativeSeries, autoRange)[0][0];
    } else if (isCoordinateLayout) {
      point = cartesianCoordinateLayout(
        data,
        relativeSeries,
        autoRange,
        (spec as IMarkPointCoordinateSpec).coordinatesOffset
      )[0];
    } else if (isPositionLayout) {
      point = positionLayout([spec.position], relativeSeries, spec.regionRelative)[0];
    }

    return { point };
  }

  protected _computeOptions(): IMarkProcessOptions {
    const spec = this._spec as any;
    const { doXYProcess } = getMarkPointProcessInfo(spec);
    const isCoordinateProcess = isValid(spec.coordinate);

    let options: IOptionAggr[];
    if (doXYProcess) {
      options = [this._processSpecXY(spec.x, spec.y)];
    } else if (isCoordinateProcess) {
      options = this._processSpecCoo(spec);
    }

    return { options };
  }
}

export const registerCartesianMarkPoint = () => {
  Factory.registerComponent(CartesianMarkPoint.type, CartesianMarkPoint);
  registerMarkPointAnimate();
};
