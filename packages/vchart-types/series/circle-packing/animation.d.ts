import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
export type CirclePackingMark = 'leaf' | 'nonLeaf' | 'label' | 'nonLeafLabel';
export type CirclePackingAppearPreset = 'growIn' | 'fadeIn';
export interface ICirclePackingAnimationParams {
  [key: string]: object;
}
export declare const circlePackingPresetAnimation: (
  _params: ICirclePackingAnimationParams,
  preset: CirclePackingAppearPreset
) => IAnimationTypeConfig;
