import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import type { ISankeyAnimationParams, SankeyAppearPreset } from './interface';
export declare const sankeyGrowIn: (params: ISankeyAnimationParams, isOverall?: boolean) => IAnimationTypeConfig;
export declare const sankeyGrowOut: (params: ISankeyAnimationParams, isOverall?: boolean) => IAnimationTypeConfig;
export declare const sankeyNodePresetAnimation: (params: ISankeyAnimationParams, preset: SankeyAppearPreset) => IAnimationTypeConfig;
export declare const sankeyLinkPresetAnimation: (preset: SankeyAppearPreset) => IAnimationTypeConfig;
export declare const registerSankeyAnimation: () => void;
