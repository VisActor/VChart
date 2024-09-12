/* eslint-disable no-duplicate-imports */
import type { EasingType } from '@visactor/vrender-core';
import type { IPointLike } from '@visactor/vutils';
import { ACustomAnimate, TagPointsUpdate } from '@visactor/vrender-core';
import { Point, isFunction, isNil, isValidNumber } from '@visactor/vutils';
import type { IPolarAxisHelper } from '../../component/axis';
import { isClose, isValidPoint, normalizeAngle } from '../../util';
import type { IPoint } from '../../typings';

export class PolarPointUpdate extends ACustomAnimate<{ x: number; y: number }> {
  declare valid: boolean;

  private _fromAngle: number;
  private _fromRadius: number;

  private _toAngle: number;
  private _toRadius: number;

  private _pointToCoord: IPolarAxisHelper['pointToCoord'];
  private _coordToPoint: IPolarAxisHelper['coordToPoint'];

  constructor(
    from: { x: number; y: number },
    to: { x: number; y: number },
    duration: number,
    easing: EasingType,
    params: {
      pointToCoord: IPolarAxisHelper['pointToCoord'];
      coordToPoint: IPolarAxisHelper['coordToPoint'];
    }
  ) {
    super(from, to, duration, easing, params);

    const pointToCoord = this.params.pointToCoord as IPolarAxisHelper['pointToCoord'];
    const coordToPoint = this.params.coordToPoint as IPolarAxisHelper['coordToPoint'];

    if (!isFunction(pointToCoord) || !isFunction(coordToPoint)) {
      this.valid = false;
    }
    this._pointToCoord = pointToCoord;
    this._coordToPoint = coordToPoint;
  }

  getEndProps(): Record<string, any> {
    if (this.valid === false) {
      return {};
    }

    return this._coordToPoint({ angle: this._toAngle, radius: this._toRadius });
  }

  onBind(): void {
    const { angle: fromAngle, radius: fromRadius } = this._pointToCoord(this.from);

    const { angle: toAngle, radius: toRadius } = this._pointToCoord(this.to);
    if (!isValidNumber(toAngle * toRadius)) {
      this.valid = false;
    }
    this._fromAngle = isValidNumber(fromAngle) ? fromAngle : toAngle;
    this._fromRadius = isValidNumber(fromRadius) ? fromRadius : toRadius;
    this._toAngle = toAngle;
    this._toRadius = toRadius;

    if (isClose(this._fromAngle, this._toAngle) && isClose(this._fromRadius, this._toRadius)) {
      this.valid = false;
    }
  }

  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    if (this.valid === false) {
      out.x = this.to.x;
      out.y = this.to.y;
      return;
    }
    if (end) {
      const { x, y } = this.getEndProps();
      out.x = x;
      out.y = y;
    } else {
      const { x, y } = this._coordToPoint({
        angle: this._fromAngle + (this._toAngle - this._fromAngle) * ratio,
        radius: this._fromRadius + (this._toRadius - this._fromRadius) * ratio
      });
      out.x = x;
      out.y = y;
    }
  }
}

// @ts-ignore
// FIXME: some private attribute should be changed to protected for better inheritance
export class PolarTagPointsUpdate extends TagPointsUpdate {
  private declare points: IPointLike[];
  private declare interpolatePoints: [IPointLike, IPointLike][];

  private _pointToCoord: IPolarAxisHelper['pointToCoord'];
  private _coordToPoint: IPolarAxisHelper['coordToPoint'];

  constructor(
    from: any,
    to: any,
    duration: number,
    easing: EasingType,
    params?: {
      newPointAnimateType?: 'grow' | 'appear';
      pointToCoord: IPolarAxisHelper['pointToCoord'];
      coordToPoint: IPolarAxisHelper['coordToPoint'];
    }
  ) {
    super(from, to, duration, easing, params);
    const pointToCoord = this.params.pointToCoord as IPolarAxisHelper['pointToCoord'];
    const coordToPoint = this.params.coordToPoint as IPolarAxisHelper['coordToPoint'];
    this._pointToCoord = pointToCoord;
    this._coordToPoint = coordToPoint;
  }

  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    // if not create new points, multi points animation might not work well.
    this.points = this.points.map((point, index) => {
      const newPoint = this.polarPointInterpolation(
        this.interpolatePoints[index][0],
        this.interpolatePoints[index][1],
        ratio
      );

      newPoint.context = point.context;
      return newPoint;
    });
    out.points = this.points;
  }

  private _interpolationSinglePoint(pointA: IPoint, pointB: IPoint, ratio: number): IPoint {
    if (!isValidPoint(pointA) && !isValidPoint(pointB)) {
      return pointB;
    }
    const polarPointA = this._pointToCoord(pointA);
    const polarPointB = this._pointToCoord(pointB);
    let angleA = normalizeAngle(polarPointA.angle);
    let angleB = normalizeAngle(polarPointB.angle);

    // handle center point radius
    if (!isValidNumber(angleA) && isValidNumber(angleB)) {
      angleA = angleB;
    }
    if (isValidNumber(angleA) && !isValidNumber(angleB)) {
      angleB = angleA;
    }
    const angle = angleA + (angleB - angleA) * ratio;
    const radius = polarPointA.radius + (polarPointB.radius - polarPointA.radius) * ratio;

    return this._coordToPoint({ angle, radius });
  }

  private polarPointInterpolation(pointA: IPointLike, pointB: IPointLike, ratio: number): IPointLike {
    const { x, y } = this._interpolationSinglePoint(pointA, pointB, ratio);
    const { x: x1, y: y1 } = this._interpolationSinglePoint(
      {
        x: pointA.x1,
        y: pointA.y1
      },
      {
        x: pointB.x1,
        y: pointB.y1
      },
      ratio
    );

    const point = new Point(x as number, y as number, x1, y1);
    point.defined = pointB.defined;
    return point;
  }
}
