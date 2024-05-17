import type { EasingType, IGraphic } from '@visactor/vrender-core';
import type { IAnimationParams } from '../../../types';
import { isObject, isString } from '@visactor/vutils';
import { Wipe } from '../../../../animate/wipeIn';
import { typewriter } from '../effect/typewriter';

export interface IMoveInParams extends IAnimationParams {
  from?: 'left' | 'right' | 'top' | 'bottom';
  move?: {
    /**
     * @default left
     */
    from?: 'left' | 'right' | 'top' | 'bottom';
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
  if (!canDoAnimation(graphic, params)) {
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
  if (!canDoAnimation(graphic, params)) {
    return false;
  }
  const { scale } = params;
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
  if (!canDoAnimation(graphic, params)) {
    return false;
  }

  const { move } = params;
  const from = move.from ?? params.from ?? 1;
  const duration = move.duration ?? params.duration;
  const easing = move.easing ?? params.easing;

  let fromX = graphic.attribute.x;
  let fromY = graphic.attribute.y;
  switch (from) {
    case 'right':
      // 从右往左进入
      fromX = graphic.parent.width;
      break;
    case 'left':
      // 从左往右进入
      fromX = -graphic.parent.width;
      break;
    case 'bottom':
      // 从下往上进入
      fromY = graphic.parent.height;
      break;
    case 'top':
      // 从上往下进入
      fromY = -graphic.parent.height;
      break;
  }
  graphic.animate().from({ x: fromX, y: fromY }, duration, easing as EasingType);
  return true;
}

export function wipeIn(graphic: IGraphic, params: IWipeInParams) {
  if (!canDoAnimation(graphic, params)) {
    return false;
  }

  const { wipe } = params;
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

const canDoAnimation = (graphic: IGraphic, animationParams: IAnimationParams) => {
  return graphic && animationParams.duration && animationParams.duration > 0;
};
