import type { IAnimationTypeConfig } from '@visactor/vgrammar-core';
export interface ILiquidAnimationParams {
    height: {
        from: () => number | number;
        to: () => number | number;
    };
    y: {
        from: () => number | number;
        to: () => number | number;
    };
}
export type LiquidAppearPreset = 'wave' | 'grow' | 'waveGrow';
export declare function liquidPresetAnimation(params: ILiquidAnimationParams, preset: LiquidAppearPreset): IAnimationTypeConfig;
export declare const registerLiquidAnimation: () => void;
