import type { DirectionType } from '../../typings';
import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
export interface IBarAnimationParams {
    xField: string;
    yField: string;
    direction: DirectionType;
    growFrom: () => number;
}
export type BarAppearPreset = 'grow' | 'fadeIn' | 'scaleIn';
export declare const barGrowIn: (params: IBarAnimationParams, isOverall?: boolean) => IAnimationTypeConfig;
export declare const barGrowOut: (params: IBarAnimationParams, isOverall?: boolean) => IAnimationTypeConfig;
export declare function barPresetAnimation(params: IBarAnimationParams, preset: BarAppearPreset | boolean): IAnimationTypeConfig;
export declare const registerBarAnimation: () => void;
export declare const registerBar3dAnimation: () => void;
