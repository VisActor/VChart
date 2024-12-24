import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import type { IBarAnimationParams, BarAppearPreset } from '../bar/interface';
import { barGrowIn, barGrowOut } from '../bar/animation';
import { Factory } from '../../core/factory';
import type { WaterfallAppearPreset } from './interface';

const Appear_FadeIn: IAnimationTypeConfig = {
  type: 'fadeIn'
};

const Appear_ScaleIn: IAnimationTypeConfig = {
  type: 'growCenterIn'
};

export function waterfallPresetAnimation(
  params: IBarAnimationParams,
  preset: WaterfallAppearPreset
): IAnimationTypeConfig {
  switch (preset) {
    case 'fadeIn':
      return Appear_FadeIn;
    case 'scaleIn':
      return Appear_ScaleIn;
    default:
      return barGrowIn(params, false);
  }
}

export const registerWaterfallAnimation = () => {
  Factory.registerAnimation('waterfall', (params: IBarAnimationParams, preset: WaterfallAppearPreset) => {
    return {
      appear: waterfallPresetAnimation(params, preset),
      enter: barGrowIn(params, false),
      exit: barGrowOut(params, false),
      disappear: barGrowOut(params, false)
    };
  });
};
