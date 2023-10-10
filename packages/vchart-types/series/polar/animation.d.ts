import type { EasingType } from '@visactor/vrender-core';
import { ACustomAnimate, TagPointsUpdate } from '@visactor/vrender-core';
import type { IPolarAxisHelper } from '../../component/axis';
export declare class PolarPointUpdate extends ACustomAnimate<{
  x: number;
  y: number;
}> {
  valid: boolean;
  private _fromAngle;
  private _fromRadius;
  private _toAngle;
  private _toRadius;
  private _pointToCoord;
  private _coordToPoint;
  constructor(
    from: {
      x: number;
      y: number;
    },
    to: {
      x: number;
      y: number;
    },
    duration: number,
    easing: EasingType,
    params: {
      pointToCoord: IPolarAxisHelper['pointToCoord'];
      coordToPoint: IPolarAxisHelper['coordToPoint'];
    }
  );
  getEndProps(): Record<string, any>;
  onBind(): void;
  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void;
}
export declare class PolarTagPointsUpdate extends TagPointsUpdate {
  private points;
  private interpolatePoints;
  private _pointToCoord;
  private _coordToPoint;
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
  );
  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void;
  private polarPointInterpolation;
}
