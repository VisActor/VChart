import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
export interface IWordcloud3dAnimationParams {
  radius: number;
  depth_3d: number;
}
export interface IWordcloudAnimationParams {
  animationConfig: () => IAnimationTypeConfig;
}
export type WordcloudAppearPreset = 'scaleIn' | 'fadeIn';
export declare const WordCloud3dAnimation: (params: IWordcloud3dAnimationParams | (() => any)) => IAnimationTypeConfig;
export declare const WordCloudScaleInAnimation: (params: IWordcloudAnimationParams) => IAnimationTypeConfig;
export declare function wordcloudPresetAnimation(
  params: IWordcloudAnimationParams,
  preset: WordcloudAppearPreset | boolean
): IAnimationTypeConfig;
export declare const registerWordCloudAnimation: () => void;
export declare const registerWordCloud3dAnimation: () => void;
