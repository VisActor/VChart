import type { IAnimationTypeConfig, IElement } from '@visactor/vgrammar-core';
import { RotateBySphereAnimate } from '@visactor/vrender';

export interface IWordcloud3dAnimationParams {
  radius: number;
  depth_3d: number;
}

export const WordCloud3dAnimation = (params: IWordcloud3dAnimationParams | (() => any)): IAnimationTypeConfig => {
  return {
    custom: RotateBySphereAnimate,
    customParameters: (datum: any, element: IElement) => {
      return params;
      // return { center: { x: params.radius, y: params.radius, z: params.depth_3d }, r: params.radius };
    },
    easing: 'linear',
    loop: Infinity,
    duration: 6000
  };
};
