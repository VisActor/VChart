import { registerLineAnimation, registerScaleInOutAnimation } from '../../animation/config';
import { Factory } from '../../core/factory';
import { Direction } from '../../typings/space';
// eslint-disable-next-line no-duplicate-imports
import type { DirectionType } from '../../typings';
import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';

export interface IAreaAnimationParams {
  direction: DirectionType;
}

export type AreaAppearPreset = 'clipIn' | 'fadeIn' | 'grow';

const Appear_ClipIn: IAnimationTypeConfig = {
  type: 'clipIn'
};

const Appear_Grow = (params: IAreaAnimationParams): IAnimationTypeConfig => {
  return {
    type: params.direction === Direction.horizontal ? 'growPointsXIn' : 'growPointsYIn',
    options: {
      orient: params.direction === Direction.horizontal ? 'positive' : 'negative'
    }
  };
};

const Appear_FadeIn: IAnimationTypeConfig = {
  type: 'fadeIn'
};

export function areaPresetAnimation(
  params: IAreaAnimationParams,
  preset: AreaAppearPreset | boolean
): IAnimationTypeConfig {
  if (preset === false) {
    return {};
  }
  switch (preset) {
    case 'grow':
      return Appear_Grow(params);
    case 'fadeIn':
      return Appear_FadeIn;
    default:
      return Appear_ClipIn;
  }
}

export const registerAreaAnimation = () => {
  Factory.registerAnimation('area', (params: IAreaAnimationParams, preset: AreaAppearPreset) => {
    return {
      appear: areaPresetAnimation(params, preset),
      enter: { type: 'fadeIn' },
      exit: { type: 'fadeOut' },
      disappear: { type: 'clipOut' }
    };
  });
  registerLineAnimation();
  registerScaleInOutAnimation();
};
