import type { IPieAnimationParams, PieAppearPreset } from '@visactor/vchart';
import { Factory, pieDisappear, pieEnter, pieExit, piePresetAnimation } from '@visactor/vchart';

export const registerPie3dAnimation = () => {
  Factory.registerAnimation('pie3d', (params: IPieAnimationParams, preset: PieAppearPreset) => {
    return {
      appear: piePresetAnimation(params, preset),
      enter: pieEnter(params),
      exit: pieExit(params),
      disappear: pieDisappear(params)
    };
  });
};
