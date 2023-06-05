import type { EasingType } from '@visactor/vrender';
import type { IPointLike } from '@visactor/vutils';
import { ACustomAnimate, TagPointsUpdate } from '@visactor/vrender';
import type { IPolarAxisHelper } from '../../component';
import { Point, isFunction, isValidNumber } from '@visactor/vutils';

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
    if (!isValidNumber(fromAngle * fromRadius)) {
      this.valid = false;
    }
    this._fromAngle = fromAngle;
    this._fromRadius = fromRadius;

    const { angle: toAngle, radius: toRadius } = this._pointToCoord(this.to);
    if (!isValidNumber(toAngle * toRadius)) {
      this.valid = false;
    }
    this._toAngle = toAngle;
    this._toRadius = toRadius;
  }

  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    if (this.valid === false) {
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

  private polarPointInterpolation(pointA: IPointLike, pointB: IPointLike, ratio: number): IPointLike {
    const polarPointA0 = this._pointToCoord(pointA);
    const polarPointA1 = this._pointToCoord({ x: pointA.x1, y: pointA.y1 });

    const polarPointB0 = this._pointToCoord(pointB);
    const polarPointB1 = this._pointToCoord({ x: pointB.x1, y: pointB.y1 });

    const angle0 = polarPointA0.angle + (polarPointB0.angle - polarPointA0.angle) * ratio;
    const radius0 = polarPointA0.radius + (polarPointB0.radius - polarPointA0.radius) * ratio;

    const angle1 = polarPointA1.angle + (polarPointB1.angle - polarPointA1.angle) * ratio;
    const radius1 = polarPointA1.radius + (polarPointB1.radius - polarPointA1.radius) * ratio;

    const { x, y } = this._coordToPoint({ angle: angle0, radius: radius0 });
    const { x: x1, y: y1 } = this._coordToPoint({ angle: angle1, radius: radius1 });

    const point = new Point(x as number, y as number, x1, y1);
    point.defined = pointB.defined;
    return point;
  }
}
