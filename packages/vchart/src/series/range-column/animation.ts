import type { DirectionType } from '../../typings';
import type { IAnimationTypeConfig } from '@visactor/vgrammar';

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
