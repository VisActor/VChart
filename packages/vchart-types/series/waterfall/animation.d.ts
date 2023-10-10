import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import type { IBarAnimationParams, BarAppearPreset } from '../bar/animation';
export type WaterfallAppearPreset = BarAppearPreset;
export declare function waterfallPresetAnimation(
  params: IBarAnimationParams,
  preset: BarAppearPreset
): IAnimationTypeConfig;
