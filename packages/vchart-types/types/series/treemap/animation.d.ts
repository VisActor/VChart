import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
export type TreemapMark = 'leaf' | 'nonLeaf';
export type TreemapAppearPreset = 'growIn' | 'fadeIn';
export declare const treemapPresetAnimation: (preset: TreemapAppearPreset) => IAnimationTypeConfig;
export declare const registerTreemapAnimation: () => void;
