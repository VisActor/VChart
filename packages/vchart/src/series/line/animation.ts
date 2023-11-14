import { Direction } from '../../typings/space';
// eslint-disable-next-line no-duplicate-imports
import type { DirectionType } from '../../typings';
import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';

export interface ILineAnimationParams {
  direction: DirectionType;
}

export type LineAppearPreset = 'clipIn' | 'fadeIn' | 'grow';

const Appear_ClipIn: IAnimationTypeConfig = {
  type: 'clipIn'
};

const Appear_FadeIn: IAnimationTypeConfig = {
  type: 'fadeIn'
};

const Appear_Grow = (params: ILineAnimationParams): IAnimationTypeConfig => {
  return {
    type: params.direction === Direction.horizontal ? 'growPointsXIn' : 'growPointsYIn',
    options: {
      orient: params.direction === Direction.horizontal ? 'positive' : 'negative'
    }
  };
};

export function linePresetAnimation(params: ILineAnimationParams, preset: LineAppearPreset): IAnimationTypeConfig {
  switch (preset) {
    case 'grow':
      return Appear_Grow(params);
    case 'fadeIn':
      return Appear_FadeIn;
    default:
      return Appear_ClipIn;
  }
}
