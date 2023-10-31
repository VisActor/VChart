import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
export type ScatterMarks = 'point' | 'label';
export type ScatterAppearPreset = 'scaleIn' | 'fadeIn';
export interface IScatterAnimationParams {
  [key: string]: object;
}
export declare const scatterPresetAnimation: (
  _params: IScatterAnimationParams,
  preset: ScatterAppearPreset
) => IAnimationTypeConfig;
export declare const registerScatterAnimation: () => void;
