import { EasingType, IGraphic } from '@visactor/vrender-core';
import { AnimationParams } from './appear';
import { Color, isString, rgbToHsl } from '@visactor/vutils';

export interface DarkenParams extends AnimationParams {
  /**
   * @default 0.8
   */
  ratio?: number;
}

export interface BrightenParams extends AnimationParams {
  /**
   * @default 1.2
   */
  ratio?: number;
}

function getBrighterColor(color: string, ratio: number) {
  if (ratio === 1) {
    return color;
  }

  const colorInstance = new Color(color);

  const { h, s, l } = rgbToHsl(colorInstance.color.r, colorInstance.color.g, colorInstance.color.b);
  const _l = Math.max(0, Math.min(100, l * ratio));
  colorInstance.setHsl(h, s, _l);
  return colorInstance.toRGBA();
}

export function darken(graphic: IGraphic, params: DarkenParams) {
  if (graphic) {
    const { duration, easing, ratio = 0.8 } = params;
    const { fill, visible, opacity } = graphic.attribute;
    if (isString(fill) && visible !== false && opacity !== 0) {
      graphic.animate().to({ fill: getBrighterColor(fill, Math.min(1, ratio)) }, duration, easing as EasingType);
    } else {
      // 渐变色
    }
  }
}

export function brighten(graphic: IGraphic, params: BrightenParams) {
  if (graphic) {
    const { duration, easing, ratio = 1.2 } = params;
    const { fill, visible, opacity } = graphic.attribute;
    if (isString(fill) && visible !== false && opacity !== 0) {
      graphic.animate().to({ fill: getBrighterColor(fill, Math.max(1, ratio)) }, duration, easing as EasingType);
    } else {
      // 渐变色
    }
  }
}
