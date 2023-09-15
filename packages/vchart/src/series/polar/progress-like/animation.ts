import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';

export type ProgressLikeAppearPreset = 'grow' | 'fadeIn';

export interface IProgressLikeAnimationParams {
  startAngle?: number;
}

const Appear_Grow = (params: IProgressLikeAnimationParams): IAnimationTypeConfig => ({
  type: 'growAngleIn',
  options: {
    overall: params.startAngle
  }
});

const Appear_FadeIn: IAnimationTypeConfig = {
  type: 'fadeIn'
};

export function progressLikePresetAnimation(params: IProgressLikeAnimationParams, preset: ProgressLikeAppearPreset) {
  switch (preset) {
    case 'fadeIn':
      return Appear_FadeIn;
    default:
      return Appear_Grow(params);
  }
}
