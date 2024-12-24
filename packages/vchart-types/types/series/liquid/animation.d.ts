import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import type { ILiquidAnimationParams, LiquidAppearPreset } from './interface';
export declare function liquidPresetAnimation(params: ILiquidAnimationParams, preset: LiquidAppearPreset): IAnimationTypeConfig;
export declare function liquidGroupPresetAnimation(params: ILiquidAnimationParams, preset: LiquidAppearPreset): IAnimationTypeConfig;
export declare const registerLiquidAnimation: () => void;
