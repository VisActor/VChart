import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import type { DirectionType } from '../../../typings';
// eslint-disable-next-line no-duplicate-imports
import { Direction } from '../../../typings/space';
import { Factory } from '../../../core/factory';

export interface ILinearProgressAnimationParams {
  direction: DirectionType;
}

export type LinearProgressAppearPreset = 'grow' | 'fadeIn';

function LinearProgressGrowOption(params: ILinearProgressAnimationParams) {
  return () => {
    if (params.direction === 'vertical') {
      return {
        orient: 'negative'
      };
    }
    return {
      orient: 'positive'
    };
  };
}

const Appear_Grow = (params: ILinearProgressAnimationParams): IAnimationTypeConfig => {
  return {
    type: params.direction === Direction.horizontal ? 'growWidthIn' : 'growHeightIn',
    options: LinearProgressGrowOption(params)
  };
};

export const linearProgressDisappear = (params: ILinearProgressAnimationParams): IAnimationTypeConfig => {
  return {
    type: params.direction === Direction.horizontal ? 'growWidthOut' : 'growHeightOut',
    options: LinearProgressGrowOption(params)
  };
};

export const Appear_FadeIn: IAnimationTypeConfig = {
  type: 'fadeIn'
};

export function linearProgressPresetAnimation(
  params: ILinearProgressAnimationParams,
  preset: LinearProgressAppearPreset | boolean
) {
  if (preset === false) {
    return {};
  }
  switch (preset) {
    case 'fadeIn':
      return Appear_FadeIn;
    default:
      return Appear_Grow(params);
  }
}

export const registerLinearProgressAnimation = () => {
  Factory.registerAnimation(
    'linearProgress',
    (params: ILinearProgressAnimationParams, preset: LinearProgressAppearPreset) => {
      return {
        appear: linearProgressPresetAnimation(params, preset),
        enter: { type: 'grow' },
        disappear: linearProgressDisappear(params)
      };
    }
  );
};
