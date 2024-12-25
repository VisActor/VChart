import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import type { BarAppearPreset, IBarAnimationParams } from './interface';
export declare const barGrowIn: (params: IBarAnimationParams, isOverall?: boolean) => IAnimationTypeConfig;
export declare const barGrowOut: (params: IBarAnimationParams, isOverall?: boolean) => IAnimationTypeConfig;
export declare function barPresetAnimation(params: IBarAnimationParams, preset: BarAppearPreset | boolean): IAnimationTypeConfig;
export declare const registerBarAnimation: () => void;
export declare const registerBar3dAnimation: () => void;
