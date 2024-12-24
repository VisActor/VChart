import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
import type { CorrelationAppearPreset, ICorrelationAnimationParams } from './interface';
export declare const correlationPresetAnimation: (_params: ICorrelationAnimationParams, preset: CorrelationAppearPreset) => IAnimationTypeConfig;
export declare const registerCorrelationAnimation: () => void;
