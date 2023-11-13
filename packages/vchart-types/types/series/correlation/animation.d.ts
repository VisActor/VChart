import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
export type CorrelationMarks = 'point' | 'label';
export type CorrelationAppearPreset = 'scaleIn' | 'fadeIn';
export interface ICorrelationAnimationParams {
    [key: string]: object;
}
export declare const correlationPresetAnimation: (_params: ICorrelationAnimationParams, preset: CorrelationAppearPreset) => IAnimationTypeConfig;
export declare const registerCorrelationAnimation: () => void;
