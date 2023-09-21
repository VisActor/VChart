import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import type { IBarAnimationParams, BarAppearPreset } from '../bar/animation';
import { barGrowIn } from '../bar/animation';

export type WaterfallAppearPreset = BarAppearPreset;

const Appear_FadeIn: IAnimationTypeConfig = {
  type: 'fadeIn'
};

const Appear_ScaleIn: IAnimationTypeConfig = {
  type: 'growCenterIn'
};

export function waterfallPresetAnimation(params: IBarAnimationParams, preset: BarAppearPreset): IAnimationTypeConfig {
  switch (preset) {
    case 'fadeIn':
      return Appear_FadeIn;
    case 'scaleIn':
      return Appear_ScaleIn;
    default:
      return barGrowIn(params, false);
  }
}
