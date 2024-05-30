import type { DirectionType } from '../../typings';
import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
export interface IAreaAnimationParams {
    direction: DirectionType;
}
export type AreaAppearPreset = 'clipIn' | 'fadeIn' | 'grow';
export declare function areaPresetAnimation(params: IAreaAnimationParams, preset: AreaAppearPreset | boolean): IAnimationTypeConfig;
export declare const registerAreaSeriesAnimation: () => void;
