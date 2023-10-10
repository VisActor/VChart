import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
export type TreemapMark = 'leaf' | 'nonLeaf';
export type TreemapAppearPreset = 'growIn' | 'fadeIn';
export declare const scatterPresetAnimation: (preset: TreemapAppearPreset) => IAnimationTypeConfig;
