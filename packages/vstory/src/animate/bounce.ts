import { ACustomAnimate } from '@visactor/vrender-core';
import type { EasingType } from '@visactor/vrender-core';

export class Bounce extends ACustomAnimate<any> {
  declare valid: boolean;

  private dy: number;
  private customEase: any;

  constructor(from: any, to: any, duration: number, easing: EasingType, params: { dy: number; customEase?: any }) {
    super(from, to, duration, easing, params);
    const { dy = 20, customEase } = params || {};
    this.dy = dy;
    if (customEase) {
      this.customEase = customEase;
    }
  }

  getEndProps(): Record<string, any> {
    return this.to;
  }

  getFromProps(): void | Record<string, any> {
    return this.from;
  }

  onBind(): void {
    this.target && this.target.setAttributes(this.from);
  }

  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    const r = this.customEase ? this.customEase(ratio) : ratio;
    out.dy = -this.dy * r;
  }
}
