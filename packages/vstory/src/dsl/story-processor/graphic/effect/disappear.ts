import type { EasingType, IGraphic } from '@visactor/vrender-core';
import type { IAnimationParams } from '../../../types';
import type { IGraphicDisappearPayLoad } from '../../../types/graphic/disappear';
import { isObject, isString } from '@visactor/vutils';
import { Wipe } from '../../../../animate/wipeIn';
import { canDoGraphicAnimation } from '../util';

export interface IFadeOutParams extends IAnimationParams {
  opacity?: 'left' | 'right' | 'top' | 'bottom';
  fade?: {
    /**
     * @default 0
     */
    opacity?: number;
    duration?: number;
    easing?: string;
    /**
     * 作用于全局的透明度
     * @default false
     */
    isBaseOpacity?: string;
  };
}

export interface IScaleOutParams extends IAnimationParams {
  ratio?: number;
  scale?: {
    /**
     * @default 0
     */
    ratio?: number;
    duration?: number;
    easing?: string;
  };
}

export interface IMoveOutParams extends IAnimationParams {
  to?: 'left' | 'right' | 'top' | 'bottom';
  move?: {
    /**
     * @default left
     */
    to?: 'left' | 'right' | 'top' | 'bottom';

    /**
     * @default true
     * @description 若为true: 多个图形的move距离不同, duration相同, 即可使的多个图形同时离开画布;  若为false: 多个图形move的距离相同, duration相同, 即可使多个图形达到相同的速度, 以保持图形的相对位置不变.
     */
    isVariableSpeed?: boolean;
    duration?: number;
    easing?: string;
  };
}

export function fadeOut(graphic: IGraphic, params: IFadeOutParams) {
  if (!canDoGraphicAnimation(graphic, params)) {
    return false;
  }

  const { fade = {} } = params;
  const opacity = fade.opacity ?? params.opacity ?? 0;
  const duration = fade.duration ?? params.duration;
  const easing = fade.easing ?? params.easing;
  const isBaseOpacity = fade.isBaseOpacity ?? false;
  const opacityKey = isBaseOpacity ? 'baseOpacity' : 'opacity';

  graphic.animate().to({ [opacityKey]: opacity }, duration, easing as EasingType);
  return true;
}

export function scaleOut(graphic: IGraphic, params: IScaleOutParams) {
  if (!canDoGraphicAnimation(graphic, params)) {
    return false;
  }
  const { scale = {} } = params;
  const ratio = scale.ratio ?? params.ratio ?? 0;
  const duration = scale.duration ?? params.duration;
  const easing = scale.easing ?? params.easing;

  graphic.animate().to({ scaleX: ratio, scaleY: ratio }, duration, easing as EasingType);
  return true;
}

export function moveOut(graphic: IGraphic, params: IMoveOutParams) {
  if (!canDoGraphicAnimation(graphic, params)) {
    return false;
  }
  const { move = {} } = params;
  const to = move.to ?? params.to ?? 1;
  const duration = move.duration ?? params.duration;
  const easing = move.easing ?? params.easing;
  const isVariableSpeed = move.isVariableSpeed ?? true;

  // 图形宽高
  const width = Math.abs(graphic.AABBBounds.x2 - graphic.AABBBounds.x1);
  const height = Math.abs(graphic.AABBBounds.y2 - graphic.AABBBounds.y1);

  let toX = graphic.attribute.x;
  let toY = graphic.attribute.y;
  if (isVariableSpeed) {
    // 同时抵达边缘, 速度不同.
    switch (to) {
      case 'right':
        // 画布容器宽度
        toX = graphic.parent.width;
        break;
      case 'left':
        // 负的图形宽度
        toX = -width;
        break;
      case 'bottom':
        // 容器高度 + 图形高度
        toY = graphic.parent.height + height;
        break;
      case 'top':
        // 负的图形高度
        toY = -height;
        break;
    }
  } else {
    // 速度相同, 相对位置不变.
    const distance = Math.max(graphic.parent.width, graphic.parent.height);
    switch (to) {
      case 'right':
        toX += distance;
        break;
      case 'left':
        toX += -distance;
        break;
      case 'bottom':
        toY += distance;
        break;
      case 'top':
        toY += -distance;
        break;
    }
  }

  console.log('debug moveOut', toX, toY);
  graphic.animate().to({ x: toX, y: toY }, duration, easing as EasingType);
  return true;
}

export const disappearEffectMap = {
  fade: fadeOut,
  scale: scaleOut,
  move: moveOut
};

export function commonDisappearEffect(
  graphic: IGraphic,
  effect: string,
  params: IGraphicDisappearPayLoad['animation']
) {
  let doAnimation = true;
  switch (effect) {
    case 'shrink':
      scaleOut(graphic, params);
      break;
    case 'fade':
      fadeOut(graphic, params);
      break;
    case 'move':
      moveOut(graphic, params as unknown as IMoveOutParams);
      break;
    default:
      doAnimation = false;
  }
  return doAnimation;
}
