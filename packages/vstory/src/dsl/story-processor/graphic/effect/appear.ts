import type { EasingType, IGraphic } from '@visactor/vrender-core';
import type { IAnimationParams } from '../../../types';
import { isObject, isString } from '@visactor/vutils';
import { Wipe } from '../../../../animate/wipeIn';
import { typewriter } from '../effect/typewriter';
import { canDoGraphicAnimation } from '../util';

export interface IMoveInParams extends IAnimationParams {
  from?: 'left' | 'right' | 'top' | 'bottom';
  move?: {
    /**
     * @default left
     */
    from?: 'left' | 'right' | 'top' | 'bottom';
    /**
     * @default true
     * @description 若为true: 多个图形的move距离不同, duration相同, 使多个图形同时抵达目标位置;  若为false: 多个图形move的距离相同, duration相同, 即可使多个图形达到相同的速度, 以保持图形的相对位置不变.
     */
    isVariableSpeed?: boolean;
    duration?: number;
    easing?: string;
  };
}

export interface IWipeInParams extends IAnimationParams {
  from?: 'left' | 'right' | 'top' | 'bottom' | 'stroke';
  wipe?: {
    /**
     * @default left
     */
    from?: 'left' | 'right' | 'top' | 'bottom' | 'stroke';
    duration?: number;
    easing?: string;
  };
}

export interface IScaleInParams extends IAnimationParams {
  ratio?: number;
  scale?: {
    /**
     * @default 1
     */
    ratio?: number;
    duration?: number;
    easing?: string;
  };
}

export interface IFadeInParams extends IAnimationParams {
  opacity?: number;
  fade?: {
    /**
     * @default 1
     */
    opacity?: number;
    duration?: number;
    easing?: string;
  };
}

export function fadeIn(graphic: IGraphic, params: IFadeInParams): boolean {
  if (!canDoGraphicAnimation(graphic, params)) {
    return false;
  }
  const { fade = {} } = params;
  const opacity = fade.opacity ?? params.opacity ?? 1;
  const duration = fade.duration ?? params.duration;
  const easing = fade.easing ?? params.easing;

  graphic.setAttributes({
    opacity: 0
  });
  graphic.animate().to({ opacity }, duration, easing as EasingType);

  return true;
}

export function scaleIn(graphic: IGraphic, params: IScaleInParams): boolean {
  if (!canDoGraphicAnimation(graphic, params)) {
    return false;
  }
  const { scale = {} } = params;
  const ratio = scale.ratio ?? params.ratio ?? 1;
  const duration = scale.duration ?? params.duration;
  const easing = scale.easing ?? params.easing;

  graphic.setAttributes({
    scaleX: 0,
    scaleY: 0
  });
  graphic.animate().to({ scaleX: ratio, scaleY: ratio }, duration, easing as EasingType);

  return true;
}

export function moveIn(graphic: IGraphic, params: IMoveInParams) {
  if (!canDoGraphicAnimation(graphic, params)) {
    return false;
  }

  const { move = {} } = params;
  const from = move.from ?? params.from ?? 1;
  const duration = move.duration ?? params.duration;
  const easing = move.easing ?? params.easing;
  const isVariableSpeed = move.isVariableSpeed ?? true;

  // 图形宽高
  const width = Math.abs(graphic.AABBBounds.x2 - graphic.AABBBounds.x1);
  const height = Math.abs(graphic.AABBBounds.y2 - graphic.AABBBounds.y1);

  let fromX = graphic.attribute.x;
  let fromY = graphic.attribute.y;
  if (isVariableSpeed) {
    // 同时从边缘进入, 速度不同, 同时抵达目标.
    switch (from) {
      case 'right':
        // 图形左边缘为起点
        fromX = graphic.parent.width;
        break;
      case 'left':
        // 图形右边缘为起点
        fromX = -width;
        break;
      case 'bottom':
        // 从下往上进入
        fromY = graphic.parent.height + height;
        break;
      case 'top':
        // 从上往下进入
        fromY = -height;
        break;
    }
  } else {
    // 速度相同, 相对位置不变, 但不同时出现.
    const distance = Math.max(graphic.parent.width, graphic.parent.height);
    switch (from) {
      case 'right':
        // 从右往左进入
        fromX += distance;
        break;
      case 'left':
        // 从左往右进入
        fromX += -distance;
        break;
      case 'bottom':
        // 从下往上进入
        fromY += distance;
        break;
      case 'top':
        // 从上往下进入
        fromY += -distance;
        break;
    }
  }

  graphic.animate().from({ x: fromX, y: fromY }, duration, easing as EasingType);
  return true;
}

export function wipeIn(graphic: IGraphic, params: IWipeInParams) {
  if (!canDoGraphicAnimation(graphic, params)) {
    return false;
  }

  const { wipe = {} } = params;
  const from = wipe.from ?? params.from ?? 1;
  const duration = wipe.duration ?? params.duration;
  const easing = wipe.easing ?? params.easing;

  const { fill } = graphic.attribute;
  if (isString(fill)) {
    graphic.animate().play(
      new Wipe({}, {}, duration, easing as EasingType, {
        direction: Direction[from]
      })
    );
  } else if (isObject(fill)) {
    // 渐变色支持
  }
  return true;
}

export const appearEffectMap = {
  fade: fadeIn,
  scale: scaleIn,
  move: moveIn,
  wipe: wipeIn,
  typewriter
};

const Direction = {
  left: 0,
  right: 1,
  top: 2,
  bottom: 3,
  stroke: 4
};
