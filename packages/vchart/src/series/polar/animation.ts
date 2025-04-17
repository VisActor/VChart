/* eslint-disable no-duplicate-imports */
import type { EasingType } from '@visactor/vrender-core';
import type { IPointLike } from '@visactor/vutils';
import { ACustomAnimate, TagPointsUpdate } from '@visactor/vrender-core';
import { Point, isValidNumber, polarToCartesian, cartesianToPolar } from '@visactor/vutils';
import { isClose, isValidPoint, normalizeAngle } from '../../util';
import type { IPoint } from '../../typings';

export class PolarPointUpdate extends ACustomAnimate<{ x: number; y: number }> {
  declare valid: boolean;

  private _fromAngle: number;
  private _fromRadius: number;

  private _toAngle: number;
  private _toRadius: number;

  private _center: IPointLike;
  private _prevCenter: IPointLike;

  constructor(
    from: { x: number; y: number; center: IPointLike },
    to: { x: number; y: number; center: IPointLike },
    duration: number,
    easing: EasingType,
    params: any
  ) {
    super(from, to, duration, easing, params);
    this._center = to.center;
    this._prevCenter = from.center;
    if (!this._center || !this._prevCenter) {
      this.valid = false;
    }
  }

  getEndProps(): Record<string, any> {
    if (this.valid === false) {
      return {};
    }
    return polarToCartesian(this._center, this._toRadius, this._toAngle);
  }

  onBind(): void {
    const { angle: fromAngle, radius: fromRadius } = cartesianToPolar(this.from, this._prevCenter);
    const { angle: toAngle, radius: toRadius } = cartesianToPolar(this.to, this._center);
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
      out.center = this._center;
    } else {
      const { x, y } = polarToCartesian(
        {
          x: this._prevCenter.x + (this._center.x - this._prevCenter.x) * ratio,
          y: this._prevCenter.y + (this._center.y - this._prevCenter.y) * ratio
        },
        this._fromRadius + (this._toRadius - this._fromRadius) * ratio,
        this._fromAngle + (this._toAngle - this._fromAngle) * ratio
      );
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

  private _center: IPointLike;
  private _prevCenter: IPointLike;

  constructor(
    from: any,
    to: any,
    duration: number,
    easing: EasingType,
    params?: {
      newPointAnimateType?: 'grow' | 'appear';
    }
  ) {
    super(from, to, duration, easing, params);
    this._center = to.center;
    this._prevCenter = from.center;
  }
  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    // if not create new points, multi points animation might not work well.
    this.points = this.points.map((point, index) => {
      const newPoint = this.polarPointInterpolation(
        this.interpolatePoints[index][0],
        this.interpolatePoints[index][1],
        ratio
      );
      if (end) {
        out.center = this._center;
      }
      newPoint.context = point.context;
      return newPoint;
    });
    out.points = this.points;
  }

  private _interpolationSinglePoint(pointA: IPoint, pointB: IPoint, ratio: number): IPoint {
    if (!isValidPoint(pointA) && !isValidPoint(pointB)) {
      return pointB;
    }
    const polarPointA = cartesianToPolar(pointA, this._prevCenter);
    const polarPointB = cartesianToPolar(pointB, this._center);
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

    return polarToCartesian(
      {
        x: this._prevCenter.x + (this._center.x - this._prevCenter.x) * ratio,
        y: this._prevCenter.y + (this._center.y - this._prevCenter.y) * ratio
      },
      radius,
      angle
    );
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
