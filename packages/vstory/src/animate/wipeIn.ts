import { ACustomAnimate } from '@visactor/vrender-core';
import type { EasingType, ILinearGradient } from '@visactor/vrender-core';

export enum Direction {
  LEFT_TO_RIGHT = 0,
  RIGHT_TO_LEFT = 1,
  TOP_TO_BOTTOM = 2,
  BOTTOM_TO_TOP = 3,
  STROKE = 4
}

export class Wipe extends ACustomAnimate<any> {
  declare direction: number;
  declare toFill: string;
  declare toStroke: string;
  declare fillGradient: ILinearGradient;
  declare strokeGradient: ILinearGradient;
  declare fill: boolean;
  declare stroke: boolean;
  constructor(
    from: any,
    to: any,
    duration: number,
    easing: EasingType,
    params?: { direction?: number; fill?: boolean; stroke?: boolean }
  ) {
    super(from, to, duration, easing, params);
    const { direction = Direction.LEFT_TO_RIGHT, fill = true, stroke = true } = params || {};
    this.direction = direction;
    this.fill = fill;
    this.stroke = stroke;
    this.fillGradient = {
      gradient: 'linear',
      stops: []
    };
    this.strokeGradient = {
      gradient: 'linear',
      stops: []
    };
  }

  getEndProps(): Record<string, any> {
    return {
      fill: this.toFill,
      stroke: this.toStroke
    };
  }

  onBind(): void {
    this.toFill = this.target.getComputedAttribute('fill');
    this.toStroke = this.target.getComputedAttribute('stroke');
  }

  onEnd(): void {
    return;
  }

  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    if (!this.toFill) {
      return;
    }
    if (!this.toStroke) {
      return;
    }
    switch (this.direction) {
      case Direction.RIGHT_TO_LEFT:
        this.rightToLeft(end, ratio, out);
        break;
      case Direction.TOP_TO_BOTTOM:
        this.topToBottom(end, ratio, out);
        break;
      case Direction.BOTTOM_TO_TOP:
        this.bottomToTop(end, ratio, out);
        break;
      case Direction.STROKE:
        this.strokePath(end, ratio, out);
        break;
      default:
        this.leftToRight(end, ratio, out);
        break;
    }

    if (end) {
      out.fill = this.toFill;
      out.stroke = this.toStroke;
    } else {
      if (this.fill) {
        const toFillColor = this.toFill;
        this.fillGradient.stops = [
          { offset: 0, color: toFillColor },
          { offset: ratio, color: toFillColor },
          { offset: Math.min(1, ratio * 2), color: 'white' }
        ];
        out.fill = this.fillGradient;
      }

      if (this.stroke) {
        const toStrokeColor = this.toStroke;
        this.strokeGradient.stops = [
          { offset: 0, color: toStrokeColor },
          { offset: ratio, color: toStrokeColor },
          { offset: Math.min(1, ratio * 2), color: 'white' }
        ];
        out.stroke = this.strokeGradient;
      }
    }
  }

  leftToRight(end: boolean, ratio: number, out: Record<string, any>) {
    if (this.fill) {
      this.fillGradient.x0 = 0;
      this.fillGradient.y0 = 0;
      this.fillGradient.x1 = 1;
      this.fillGradient.y1 = 0;
    }
    if (this.stroke) {
      this.strokeGradient.x0 = 0;
      this.strokeGradient.y0 = 0;
      this.strokeGradient.x1 = 1;
      this.strokeGradient.y1 = 0;
    }
  }

  strokePath(end: boolean, ratio: number, out: Record<string, any>) {
    if (this.fill) {
      this.fillGradient.x0 = 0;
      this.fillGradient.y0 = 0;
      this.fillGradient.x1 = 1;
      this.fillGradient.y1 = 0;
    }
    if (this.stroke) {
      const dashLen = 300;
      const offset = ratio * dashLen;
      out.lineDash = [offset, dashLen - offset];
    }
    return;
  }

  rightToLeft(end: boolean, ratio: number, out: Record<string, any>) {
    if (this.fill) {
      this.fillGradient.x0 = 1;
      this.fillGradient.y0 = 0;
      this.fillGradient.x1 = 0;
      this.fillGradient.y1 = 0;
    }
    if (this.stroke) {
      this.strokeGradient.x0 = 1;
      this.strokeGradient.y0 = 0;
      this.strokeGradient.x1 = 0;
      this.strokeGradient.y1 = 0;
    }
  }

  topToBottom(end: boolean, ratio: number, out: Record<string, any>) {
    if (this.fill) {
      this.fillGradient.x0 = 0;
      this.fillGradient.y0 = 0;
      this.fillGradient.x1 = 0;
      this.fillGradient.y1 = 1;
    }
    if (this.stroke) {
      this.strokeGradient.x0 = 0;
      this.strokeGradient.y0 = 0;
      this.strokeGradient.x1 = 0;
      this.strokeGradient.y1 = 1;
    }
  }

  bottomToTop(end: boolean, ratio: number, out: Record<string, any>) {
    if (this.fill) {
      this.fillGradient.x0 = 0;
      this.fillGradient.y0 = 1;
      this.fillGradient.x1 = 0;
      this.fillGradient.y1 = 0;
    }
    if (this.stroke) {
      this.strokeGradient.x0 = 0;
      this.strokeGradient.y0 = 1;
      this.strokeGradient.x1 = 0;
      this.strokeGradient.y1 = 0;
    }
  }
}
