import type { IAnimationTypeConfig } from '@visactor/vgrammar';
import type { Datum } from '../../typings';

export interface IRoseAnimationParams {
  innerRadius: () => number;
  growField?: 'angle' | 'radius';
}

export type RoseAppearPreset = 'growAngle' | 'growRadius' | 'fadeIn';

export const Appear_Grow = (params: IRoseAnimationParams): IAnimationTypeConfig => {
  const from = params.growField === 'angle' ? 0 : params.innerRadius;
  //TODO: 待 vgrammar 内置后替换
  return params.growField === 'angle'
    ? {
        type: params.growField === 'angle' ? 'growAngleIn' : 'growRadiusIn'
      }
    : {
        channel: {
          innerRadius: { from, to: (datum: Datum, element: any) => element.getGraphicAttribute('innerRadius') },
          outerRadius: { from, to: (datum: Datum, element: any) => element.getGraphicAttribute('outerRadius') }
        }
      };
};

export const Appear_FadeIn: IAnimationTypeConfig = {
  type: 'fadeIn'
};

export const roseEnter = (params: IRoseAnimationParams): IAnimationTypeConfig => {
  return {
    type: params.growField === 'angle' ? 'growAngleIn' : 'growRadiusIn'
  };
};

export const roseExit = (params: IRoseAnimationParams): IAnimationTypeConfig => {
  return {
    type: params.growField === 'angle' ? 'growAngleOut' : 'growRadiusOut'
  };
};

export const roseDisappear = (params: IRoseAnimationParams): IAnimationTypeConfig => {
  return {
    type: params.growField === 'angle' ? 'growAngleOut' : 'growRadiusOut'
  };
};

export function rosePresetAnimation(
  params: IRoseAnimationParams,
  preset: RoseAppearPreset | boolean
): IAnimationTypeConfig {
  if (preset === false) {
    return {};
  }
  switch (preset) {
    case 'fadeIn':
      return Appear_FadeIn;
    case 'growAngle':
      return Appear_Grow({
        ...params,
        growField: 'angle'
      });
    default:
      return Appear_Grow({
        ...params,
        growField: 'radius'
      });
  }
}
