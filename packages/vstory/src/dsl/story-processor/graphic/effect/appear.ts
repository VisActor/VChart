import type { EasingType, IGraphic } from '@visactor/vrender-core';
import type { IGraphicAppearPayLoad } from '../../../types/graphic/appear';
import type { IAnimationParams } from '../../../types';
import { isObject, isString } from '@visactor/vutils';
import { Wipe } from '../../../../animate/wipeIn';

export interface IMoveInParams extends IAnimationParams {
  from: 'left' | 'right' | 'top' | 'bottom';
}

export function fadeIn(graphic: IGraphic, params: IAnimationParams) {
  if (graphic) {
    const { duration, easing } = params;
    graphic.animate().from({ opacity: 0 }, duration, easing as EasingType);
  }
}

export function scaleIn(graphic: IGraphic, params: IAnimationParams) {
  if (graphic) {
    const { duration, easing } = params;
    graphic.animate().from({ scaleX: 0, scaleY: 0 }, duration, easing as EasingType);
  }
}

export function moveIn(graphic: IGraphic, params: IMoveInParams) {
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

export interface IWipeInParams extends IAnimationParams {
  from: 'left' | 'right' | 'top' | 'bottom' | 'stroke';
}

const Direction = {
  left: 0,
  right: 1,
  top: 2,
  bottom: 3,
  stroke: 4
};

export function wipeIn(graphic: IGraphic, params: IWipeInParams) {
  if (graphic) {
    const { duration, easing = 'linear', from = 'left' } = params;
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
  }
}

export function commonAppearEffect(graphic: IGraphic, effect: string, params: IGraphicAppearPayLoad['animation']) {
  let doAnimation = !!effect && params.duration > 0;
  switch (effect) {
    case 'grow':
      scaleIn(graphic, params);
      break;
    case 'fade':
      fadeIn(graphic, params);
      break;
    case 'move':
      moveIn(graphic, params as unknown as IMoveInParams);
      break;
    case 'wipe':
      wipeIn(graphic, params as unknown as IWipeInParams);
      break;
    default:
      doAnimation = false;
  }
  return doAnimation;
}
