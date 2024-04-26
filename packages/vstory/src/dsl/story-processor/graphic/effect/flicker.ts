import { EasingType, IGraphic } from '@visactor/vrender-core';
import { AnimationParams } from './appear';

export interface FlickerParams extends AnimationParams {
  frequency?: number;
}

export function flicker(graphic: IGraphic, params: FlickerParams) {
  if (graphic) {
    const { duration, easing, frequency = 2 } = params;
    const loopDuration = duration / frequency;
    graphic
      .animate()
      .from({ opacity: 0 }, loopDuration, easing as EasingType)
      .loop(frequency);
  }
}
