import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
export type VennMark = 'circle' | 'overlap';
export type VennAppearPreset = 'growIn' | 'fadeIn' | 'scaleIn';
export declare const vennCirclePresetAnimation: (preset: VennAppearPreset) => IAnimationTypeConfig;
export declare const vennOverlapPresetAnimation: (preset: VennAppearPreset) => IAnimationTypeConfig;
export declare const registerVennAnimation: () => void;
