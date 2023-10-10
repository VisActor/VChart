import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import type { DirectionType } from '../../../typings';
export interface ILinearProgressAnimationParams {
  direction: DirectionType;
}
export type LinearProgressAppearPreset = 'grow' | 'fadeIn';
export declare const linearProgressDisappear: (params: ILinearProgressAnimationParams) => IAnimationTypeConfig;
export declare const Appear_FadeIn: IAnimationTypeConfig;
export declare function linearProgressPresetAnimation(
  params: ILinearProgressAnimationParams,
  preset: LinearProgressAppearPreset | boolean
): IAnimationTypeConfig;
