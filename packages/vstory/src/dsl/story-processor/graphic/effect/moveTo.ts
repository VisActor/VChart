import { EasingType, IGraphic } from '@visactor/vrender-core';
import { IAnimationParams } from '../../../types';

export interface IMoveToParams extends IAnimationParams {
  destination: { x: number; y: number };
}

export function moveTo(graphic: IGraphic, params: IMoveToParams) {
  if (graphic) {
    const { duration, easing, destination } = params;
    if (destination) {
      graphic.animate().to(destination, duration, easing as EasingType);
    }
  }
}
