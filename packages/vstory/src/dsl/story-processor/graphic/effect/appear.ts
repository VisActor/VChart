import type { EasingType, IGraphic } from '@visactor/vrender-core';
import { isObject, isString } from '@visactor/vutils';
import { WipeIn } from '../../../../animate/wipeIn';

export interface AnimationParams {
  duration: number;
  easing: string;
}

interface MoveInParams extends AnimationParams {
  from: 'left' | 'right' | 'top' | 'bottom';
}

export function fadeIn(graphic: IGraphic, params: AnimationParams) {
  if (graphic) {
    const { duration, easing } = params;
    graphic.animate().from({ opacity: 0 }, duration, easing as EasingType);
  }
}

export function scaleIn(graphic: IGraphic, params: AnimationParams) {
  if (graphic) {
    const { duration, easing } = params;
    graphic.animate().from({ scaleX: 0, scaleY: 0 }, duration, easing as EasingType);
  }
}

export function moveIn(graphic: IGraphic, params: MoveInParams) {
  if (graphic) {
    const { duration, easing, from = 'right' } = params;
    let fromX = graphic.attribute.x;
    let fromY = graphic.attribute.y;
    switch (from) {
      case 'right':
        fromX = graphic.parent.width;
        break;
      case 'left':
        fromX = 0;
        break;
      case 'bottom':
        fromY = graphic.parent.height;
        break;
      case 'top':
        fromY = 0;
        break;
    }
    graphic.animate().from({ x: fromX, y: fromY }, duration, easing as EasingType);
  }
}

interface WipeInParams extends AnimationParams {
  from: 'left' | 'right' | 'top' | 'bottom' | 'stroke';
}

const Direction = {
  left: 0,
  right: 1,
  top: 2,
  bottom: 3,
  stroke: 4
};

export function wipeIn(graphic: IGraphic, params: WipeInParams) {
  if (graphic) {
    const { duration, easing = 'linear', from = 'left' } = params;
    const { fill } = graphic.attribute;
    if (isString(fill)) {
      graphic.animate().play(
        new WipeIn({}, {}, duration, easing as EasingType, {
          direction: Direction[from]
        })
      );
    } else if (isObject(fill)) {
      // 渐变色支持
    }
  }
}

export function commonAppearEffect(graphic: IGraphic, effect: string, params: AnimationParams) {
  let doAnimation = true;
  switch (effect) {
    case 'grow':
      scaleIn(graphic, params);
      break;
    case 'fadeIn':
      fadeIn(graphic, params);
      break;
    case 'moveIn':
      moveIn(graphic, params as MoveInParams);
      break;
    case 'wipeIn':
      wipeIn(graphic, params as MoveInParams);
      break;
    default:
      doAnimation = false;
  }
  return doAnimation;
}
