import type { DirectionType } from '../../typings';
import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
export interface IRangeColumnAnimationParams {
  direction: DirectionType;
}
export type RangeColumnAppearPreset = 'fadeIn' | 'grow';
export declare const rangeColumnGrowIn: (params: IRangeColumnAnimationParams) => IAnimationTypeConfig;
export declare const rangeColumnGrowOut: (params: IRangeColumnAnimationParams) => IAnimationTypeConfig;
export declare function rangeColumnPresetAnimation(
  params: IRangeColumnAnimationParams,
  preset: RangeColumnAppearPreset
): IAnimationTypeConfig;
