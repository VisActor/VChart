import { ComponentTypeEnum } from '../../interface/type';
import type { IOptionAggr } from '../../../data/transforms/aggregation';
import { cartesianCoordinateLayout, getMarkAreaProcessInfo, positionLayout, xyLayout } from '../utils';
import type { MarkAreaAttrs } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { MarkArea as MarkAreaComponent, registerMarkArcAreaAnimate } from '@visactor/vrender-components';
// eslint-disable-next-line no-duplicate-imports
import { isValid } from '@visactor/vutils';
import { Factory } from '../../../core/factory';
import type { IPoint } from '../../../typings';
import type { IMarkProcessOptions } from '../interface';
import { BaseMarkArea } from './base-mark-area';

export class CartesianMarkArea extends BaseMarkArea {
  static type = ComponentTypeEnum.cartesianMarkArea;
  type = ComponentTypeEnum.cartesianMarkArea;
  name: string = ComponentTypeEnum.cartesianMarkArea;
  static coordinateType = 'cartesian';
  coordinateType = 'cartesian';

  protected _newMarkAreaComponent(attr: MarkAreaAttrs): MarkAreaComponent {
    return new MarkAreaComponent(attr);
  }

  protected _computePointsAttr() {
    const spec = this._spec as any;
    const data = this._markerData;
    const startRelativeSeries = this._startRelativeSeries;
    const endRelativeSeries = this._endRelativeSeries;
    const relativeSeries = this._relativeSeries;

    const { doXProcess, doYProcess, doXYProcess, doCoordinatesProcess } = getMarkAreaProcessInfo(spec);

    const isPositionLayout = isValid(spec.positions);
    const autoRange = spec.autoRange ?? false;

    let points: IPoint[] = [];
    let lines: IPoint[][] = [];
    if (doXYProcess) {
      lines = xyLayout(data, startRelativeSeries, endRelativeSeries, relativeSeries, autoRange);
      // 格式为 [[{x, y}], [{x, y}]]
      // 顺序为左下角开始逆时针绘制
      const [start, end] = lines;
      if (start && start.length && end && end.length) {
        points = [
          {
            x: start[0].x,
            y: end[0].y
          },
          start[0],
          {
            x: end[0].x,
            y: start[0].y
          },
          end[0]
        ];
      }
    } else if (doXProcess || doYProcess) {
      lines = xyLayout(data, startRelativeSeries, endRelativeSeries, relativeSeries, autoRange);
      const [start, end] = lines;
      if (start && start.length && end && end.length) {
        points = [...start, end[1], end[0]];
      }
    } else if (doCoordinatesProcess) {
      points = cartesianCoordinateLayout(data, relativeSeries, autoRange, spec.coordinatesOffset);
    } else if (isPositionLayout) {
      points = positionLayout(spec.positions, relativeSeries, spec.regionRelative);
    }

    return { points };
  }

  protected _computeOptions(): IMarkProcessOptions {
    const spec = this._spec as any;
    const { doXProcess, doYProcess, doXYProcess, doCoordinatesProcess } = getMarkAreaProcessInfo(spec);

    let options: IOptionAggr[];
    if (doXYProcess) {
      options = [this._processSpecXY(spec.x, spec.y), this._processSpecXY(spec.x1, spec.y1)];
    } else if (doXProcess) {
      options = [this._processSpecX(spec.x), this._processSpecX(spec.x1)];
    } else if (doYProcess) {
      options = [this._processSpecY(spec.y), this._processSpecY(spec.y1)];
    } else if (doCoordinatesProcess) {
      options = this._processSpecCoo(spec);
    }
    return { options };
  }
}

export const registerCartesianMarkArea = () => {
  Factory.registerComponent(CartesianMarkArea.type, CartesianMarkArea);
  registerMarkArcAreaAnimate();
};
