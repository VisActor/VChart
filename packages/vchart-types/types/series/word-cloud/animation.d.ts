import type { IWordcloud3dAnimationParams, IWordcloudAnimationParams, WordcloudAppearPreset } from './interface';
import type { IAnimationTypeConfig } from '../../animation/interface';
export declare const WordCloud3dAnimation: (params: IWordcloud3dAnimationParams | (() => any)) => IAnimationTypeConfig;
export declare const WordCloudScaleInAnimation: (params: IWordcloudAnimationParams) => IAnimationTypeConfig;
export declare function wordcloudPresetAnimation(params: IWordcloudAnimationParams, preset: WordcloudAppearPreset | boolean): IAnimationTypeConfig;
export declare const registerWordCloudAnimation: () => void;
export declare const registerWordCloud3dAnimation: () => void;
