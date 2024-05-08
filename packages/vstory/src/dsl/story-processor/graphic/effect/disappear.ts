import type { EasingType, IGraphic } from '@visactor/vrender-core';
import type { IAnimationParams } from '../../../types';
import type { IGraphicDisappearPayLoad } from '../../../types/graphic/disappear';
import { isObject, isString } from '@visactor/vutils';
import { Wipe } from '../../../../animate/wipeIn';

export interface IMoveOutParams extends IAnimationParams {
  from: 'left' | 'right' | 'top' | 'bottom';
}

export function fadeOut(graphic: IGraphic, params: IAnimationParams) {
  if (graphic) {
    const { duration, easing } = params;
    graphic.animate().to({ opacity: 0 }, duration, easing as EasingType);
  }
}

export function scaleOut(graphic: IGraphic, params: IAnimationParams) {
  if (graphic) {
    const { duration, easing } = params;
    graphic.animate().to({ scaleX: 0, scaleY: 0 }, duration, easing as EasingType);
  }
}

export function moveOut(graphic: IGraphic, params: IMoveOutParams) {
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
    graphic.animate().to({ x: fromX, y: fromY }, duration, easing as EasingType);
  }
}

export interface IWipeOutParams extends IAnimationParams {
  to: 'left' | 'right' | 'top' | 'bottom' | 'stroke';
}

const Direction = {
  left: 0,
  right: 1,
  top: 2,
  bottom: 3,
  stroke: 4
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
