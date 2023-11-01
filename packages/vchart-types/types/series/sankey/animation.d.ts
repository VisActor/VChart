import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import type { DirectionType } from '../../typings';
export type SankeyMark = 'node' | 'link' | 'label';
export type SankeyAppearPreset = 'growIn' | 'fadeIn';
export interface ISankeyAnimationParams {
    direction: DirectionType;
    growFrom: () => number;
}
export declare const sankeyGrowIn: (params: ISankeyAnimationParams, isOverall?: boolean) => IAnimationTypeConfig;
export declare const sankeyGrowOut: (params: ISankeyAnimationParams, isOverall?: boolean) => IAnimationTypeConfig;
export declare const sankeyNodePresetAnimation: (params: ISankeyAnimationParams, preset: SankeyAppearPreset) => IAnimationTypeConfig;
export declare const sankeyLinkPresetAnimation: (preset: SankeyAppearPreset) => IAnimationTypeConfig;
export declare const registerSankeyAnimation: () => void;
