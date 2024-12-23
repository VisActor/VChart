import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import type { ILinearProgressAnimationParams, LinearProgressAppearPreset } from './interface';
export declare const linearProgressDisappear: (params: ILinearProgressAnimationParams) => IAnimationTypeConfig;
export declare const Appear_FadeIn: IAnimationTypeConfig;
export declare function linearProgressPresetAnimation(params: ILinearProgressAnimationParams, preset: LinearProgressAppearPreset | boolean): IAnimationTypeConfig;
export declare const registerLinearProgressAnimation: () => void;
