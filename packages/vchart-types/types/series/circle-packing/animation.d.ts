import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
export type CirclePackingMark = 'leaf' | 'nonLeaf' | 'label' | 'nonLeafLabel';
export type CirclePackingAppearPreset = 'growIn' | 'fadeIn';
export declare const circlePackingPresetAnimation: (preset: CirclePackingAppearPreset) => IAnimationTypeConfig;
export declare const registerCirclePackingAnimation: () => void;
