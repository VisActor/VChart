import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import { Factory } from '../../core';

export type ProgressLikeAppearPreset = 'grow' | 'fadeIn';

export interface IProgressLikeAnimationParams {
  startAngle?: number;
}

const Appear_Grow = (params: IProgressLikeAnimationParams): IAnimationTypeConfig => ({
  channel: {
    angle: {
      from: params.startAngle + Math.PI / 2
    }
  }
});

const Appear_FadeIn: IAnimationTypeConfig = {
  type: 'fadeIn'
};

export function gaugePointerPresetAnimation(params: IProgressLikeAnimationParams, preset: ProgressLikeAppearPreset) {
  switch (preset) {
    case 'fadeIn':
      return Appear_FadeIn;
    default:
      return Appear_Grow(params);
  }
}

export const registerGaugePointerAnimation = () => {
  Factory.registerAnimation(
    'gaugePointer',
    (params: IProgressLikeAnimationParams, preset: ProgressLikeAppearPreset) => {
      const animation = gaugePointerPresetAnimation(params, preset);
      return {
        appear: animation,
        enter: animation,
        disappear: { type: 'fadeOut' }
      };
    }
  );
};
