import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';

export type HeatmapAppearPreset = 'fadeIn';

const Appear_FadeIn: IAnimationTypeConfig = {
  type: 'fadeIn'
};

export function heatmapPresetAnimation(preset: HeatmapAppearPreset | boolean): IAnimationTypeConfig {
  if (preset === false) {
    return {};
  }
  return Appear_FadeIn;
}
