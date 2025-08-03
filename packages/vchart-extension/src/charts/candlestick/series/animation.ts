import type { EasingType, ILineAttribute, IRectAttribute } from '@visactor/vrender-core';
import type { IGlyph } from '@visactor/vrender-core';
import type { IAnimationParameters } from '@visactor/vchart';
import { isValidNumber } from '@visactor/vutils';
import { ACustomAnimate, AnimateExecutor } from '@visactor/vrender-animate';

export interface ICandlestickScaleAnimationOptions {
  center?: number;
}

type TypeAnimation = (
  graphic: IGlyph,
  options: ICandlestickScaleAnimationOptions,
  animationParameters: IAnimationParameters
) => { from?: { [channel: string]: any }; to?: { [channel: string]: any } };

const scaleIn = (
  computeCenter: (graphic: IGlyph, options: ICandlestickScaleAnimationOptions) => number
): TypeAnimation => {
  return (graphic: IGlyph, options: ICandlestickScaleAnimationOptions, animationParameters: IAnimationParameters) => {
    const finalAttribute = graphic.getFinalAttribute();
    const center = computeCenter(graphic, options);
    if (!isValidNumber(center)) {
      return {};
    }
    const { x, y, open, high, low, close } = finalAttribute;
    const animateAttributes: any = { from: { x, y }, to: { x, y } };
    if (isValidNumber(open) && isValidNumber(close)) {
      if (open > close) {
        animateAttributes.from.open = low;
        animateAttributes.to.open = open;
        animateAttributes.from.close = low;
        animateAttributes.to.close = close;
        if (isValidNumber(high)) {
          animateAttributes.from.high = low;
          animateAttributes.to.high = high;
        }
      } else {
        animateAttributes.from.open = high;
        animateAttributes.to.open = open;
        animateAttributes.from.close = high;
        animateAttributes.to.close = close;
        if (isValidNumber(low)) {
          animateAttributes.from.low = high;
          animateAttributes.to.low = low;
        }
      }
    }
    return animateAttributes;
  };
};

const scaleOut = (
  computeCenter: (mark: IGlyph, options: ICandlestickScaleAnimationOptions) => number
): TypeAnimation => {
  return (graphic: IGlyph, options: ICandlestickScaleAnimationOptions, animationParameters: IAnimationParameters) => {
    const finalAttribute = graphic.getFinalAttribute();
    const center = computeCenter(graphic, options);
    if (!isValidNumber(center)) {
      return {};
    }
    const { x, y, open, high, low, close } = finalAttribute;

    const animateAttributes: any = { from: { x, y }, to: { x, y } };
    if (isValidNumber(open) && isValidNumber(close)) {
      if (open > close) {
        animateAttributes.from.open = open;
        animateAttributes.to.open = low;
        animateAttributes.from.close = close;
        animateAttributes.to.close = low;
        if (isValidNumber(high)) {
          animateAttributes.from.high = high;
          animateAttributes.to.high = low;
        }
      } else {
        animateAttributes.from.open = open;
        animateAttributes.to.open = high;
        animateAttributes.from.close = close;
        animateAttributes.to.close = high;
        if (isValidNumber(low)) {
          animateAttributes.from.low = low;
          animateAttributes.to.low = high;
        }
      }
    }
    return animateAttributes;
  };
};
const getGlyphChildByName = (mark: IGlyph, name: string) => {
  return mark.getSubGraphic().find(child => child.name === name);
};

const computeCandlestickCenter = (glyphMark: IGlyph, options: ICandlestickScaleAnimationOptions) => {
  if (options && isValidNumber(options.center)) {
    return options.center;
  }
  const lineAttr = getGlyphChildByName(glyphMark, 'line')?.attribute as ILineAttribute | undefined;
  const boxAttr = getGlyphChildByName(glyphMark, 'box')?.attribute as IRectAttribute | undefined;

  if (boxAttr && isValidNumber(boxAttr.y1) && isValidNumber(boxAttr.height)) {
    const y0 = boxAttr.y1 - boxAttr.height;
    const y1 = boxAttr.y1;
    return (y0 + y1) / 2;
  }

  if (lineAttr?.points?.length === 2) {
    const y0 = lineAttr.points[0].y;
    const y1 = lineAttr.points[1].y;
    return (y0 + y1) / 2;
  }

  return NaN;
};

export class CandlestickScaleIn extends ACustomAnimate<Record<string, number>> {
  constructor(from: null, to: null, duration: number, easing: EasingType, params?: ICandlestickScaleAnimationOptions) {
    super(from, to, duration, easing, params);
  }

  onBind(): void {
    super.onBind();
    const finalAttribute = this.target.getFinalAttribute();
    if (finalAttribute) {
      this.target.setAttributes(finalAttribute);
    }
    const { from, to } = this.computeAttribute();
    this.propKeys = Object.keys(to).filter(key => to[key] != null);
    this.animate.reSyncProps();
    this.from = from;
    this.to = to;
    this.target.setAttributes(this.from);
  }

  computeAttribute() {
    const attr = scaleIn(computeCandlestickCenter)(this.target as IGlyph, this.params, this.params.options);
    return attr;
  }

  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    const attribute: Record<string, any> = this.target.attribute;
    this.propKeys.forEach(key => {
      attribute[key] = this.from[key] + (this.to[key] - this.from[key]) * ratio;
    });
    this.target.setAttributes(attribute);
  }
}

export class CandlestickScaleOut extends ACustomAnimate<Record<string, number>> {
  constructor(from: null, to: null, duration: number, easing: EasingType, params?: ICandlestickScaleAnimationOptions) {
    super(from, to, duration, easing, params);
  }

  onBind(): void {
    if (this.params?.diffAttrs) {
      this.target.setAttributes(this.params.diffAttrs);
    }
    const { from, to } = this.computeAttribute();
    this.propKeys = Object.keys(to).filter(key => to[key] != null);
    this.animate.reSyncProps();
    this.from = from;
    this.to = to;
    this.target.setAttributes(this.from);
  }

  computeAttribute() {
    const attr = scaleOut(computeCandlestickCenter)(this.target as IGlyph, this.params, this.params.options);
    return attr;
  }

  onUpdate(end: boolean, ratio: number, out: Record<string, any>): void {
    const attribute: Record<string, any> = this.target.attribute;
    this.propKeys.forEach(key => {
      attribute[key] = this.from[key] + (this.to[key] - this.from[key]) * ratio;
    });
    this.target.setAttributes(attribute);
  }
}

export const registerCandlestickScaleAnimation = () => {
  AnimateExecutor.registerBuiltInAnimate('candlestickScaleIn', CandlestickScaleIn);
  AnimateExecutor.registerBuiltInAnimate('candlestickScaleOut', CandlestickScaleOut);
};
