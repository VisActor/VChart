import type { DirectionType } from '../../typings';
import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
export interface ILineAnimationParams {
    direction: DirectionType;
}
export type LineAppearPreset = 'clipIn' | 'fadeIn' | 'grow';
export declare function linePresetAnimation(params: ILineAnimationParams, preset: LineAppearPreset): IAnimationTypeConfig;
