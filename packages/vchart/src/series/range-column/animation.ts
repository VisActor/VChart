import { Factory } from '../../core/factory';
import type { DirectionType } from '../../typings';
import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';

export interface IRangeColumnAnimationParams {
  direction: DirectionType;
}

export type RangeColumnAppearPreset = 'fadeIn' | 'grow';

export const rangeColumnGrowIn = (params: IRangeColumnAnimationParams): IAnimationTypeConfig => {
  return {
    type: 'growCenterIn',
    options: {
      direction: params.direction === 'horizontal' ? 'x' : 'y'
    }
  };
};

const Appear_FadeIn: IAnimationTypeConfig = {
  type: 'fadeIn'
};

export const rangeColumnGrowOut = (params: IRangeColumnAnimationParams): IAnimationTypeConfig => {
  return {
    type: 'growCenterOut',
    options: {
      direction: params.direction === 'horizontal' ? 'x' : 'y'
    }
  };
};

export function rangeColumnPresetAnimation(
  params: IRangeColumnAnimationParams,
  preset: RangeColumnAppearPreset
): IAnimationTypeConfig {
  switch (preset) {
    case 'fadeIn':
      return Appear_FadeIn;
    case 'grow':
    default:
      return rangeColumnGrowIn(params);
  }
}

export const registerRangeColumnAnimation = () => {
  Factory.registerAnimation('rangeColumn', (params: IRangeColumnAnimationParams, preset: RangeColumnAppearPreset) => ({
    appear: rangeColumnPresetAnimation(params, preset),
    enter: rangeColumnGrowIn(params),
    exit: rangeColumnGrowOut(params),
    disappear: rangeColumnGrowOut(params)
  }));
};
