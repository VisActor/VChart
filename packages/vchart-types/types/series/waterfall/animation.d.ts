import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import type { IBarAnimationParams } from '../bar/interface';
import type { WaterfallAppearPreset } from './interface';
export declare function waterfallPresetAnimation(params: IBarAnimationParams, preset: WaterfallAppearPreset): IAnimationTypeConfig;
export declare const registerWaterfallAnimation: () => void;
