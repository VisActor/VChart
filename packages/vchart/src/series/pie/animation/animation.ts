import type { IElement, IAnimationTypeConfig } from '@visactor/vgrammar';
import { AnimationStateEnum } from '../../../animation/interface';
import type { Datum } from '../../../typings';

export interface IPieAnimationParams {
  growField?: 'angle' | 'radius';
  growFrom: (datum: Datum, element: IElement, state: AnimationStateEnum) => number;
}

export type PieAppearPreset = 'growAngle' | 'growRadius' | 'fadeIn';

/**
 * grow生长option
 * 在appear时，所有柱子一起从同一个位置生长，需要growXXXOverall效果；
 * 在enter时，柱子应该从自身位置生长；
 * @param params
 * @param isOverall
 * @returns
 */
export function pieGrowOption(pieParams: IPieAnimationParams, isOverall: boolean, state: AnimationStateEnum) {
  return (datum: Datum, element: IElement, params: AnimationStateEnum) => {
    if (isOverall) {
      if (pieParams.growField === 'radius') {
        return {
          overall: 0
        };
      }
      return {
        overall: pieParams.growFrom(datum, element, state)
      };
    }
    return {
      overall: false
    };
  };
}

export const Appear_Grow = (params: IPieAnimationParams): IAnimationTypeConfig => {
  return {
    type: params.growField === 'radius' ? 'growRadiusIn' : 'growAngleIn',
    options: pieGrowOption(params, true, AnimationStateEnum.appear)
  };
};

export const Appear_FadeIn = {
  type: 'fadeIn'
};

export const pieEnter = (params: IPieAnimationParams): IAnimationTypeConfig => {
  return {
    type: params.growField === 'radius' ? 'growRadiusIn' : 'growAngleIn',
    easing: 'linear',
    options: pieGrowOption(params, true, AnimationStateEnum.enter)
  };
};

export const pieExit = (params: IPieAnimationParams): IAnimationTypeConfig => {
  return {
    type: params.growField === 'radius' ? 'growRadiusOut' : 'growAngleOut',
    easing: 'linear',
    options: pieGrowOption(params, true, AnimationStateEnum.exit)
  };
};

export const pieDisappear = (params: IPieAnimationParams): IAnimationTypeConfig => {
  return {
    type: params.growField === 'radius' ? 'growRadiusOut' : 'growAngleOut',
    options: pieGrowOption(params, true, AnimationStateEnum.exit)
  };
};

export function piePresetAnimation(params: IPieAnimationParams, preset: PieAppearPreset | boolean) {
  if (preset === false) {
    return {};
  }
  switch (preset) {
    case 'fadeIn':
      return Appear_FadeIn;
    case 'growRadius':
      return Appear_Grow({
        ...params,
        growField: 'radius'
      });
    default:
      return Appear_Grow({
        ...params,
        growField: 'angle'
      });
  }
}
