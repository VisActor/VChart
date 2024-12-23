import type { IElement, IAnimationTypeConfig } from '@visactor/vgrammar-core';
import { AnimationStateEnum } from '../../../animation/interface';
import type { Datum } from '../../../typings';
import type { IPieAnimationParams, PieAppearPreset } from '../interface';
export declare function pieGrowOption(pieParams: IPieAnimationParams, isOverall: boolean, state: AnimationStateEnum): (datum: Datum, element: IElement, params: AnimationStateEnum) => {
    overall: number;
} | {
    overall: boolean;
};
export declare const Appear_Grow: (params: IPieAnimationParams) => IAnimationTypeConfig;
export declare const Appear_FadeIn: {
    type: string;
};
export declare const pieEnter: (params: IPieAnimationParams) => IAnimationTypeConfig;
export declare const pieExit: (params: IPieAnimationParams) => IAnimationTypeConfig;
export declare const pieDisappear: (params: IPieAnimationParams) => IAnimationTypeConfig;
export declare function piePresetAnimation(params: IPieAnimationParams, preset: PieAppearPreset | boolean): IAnimationTypeConfig | {
    type: string;
};
export declare const registerPieAnimation: () => void;
export declare const registerEmptyCircleAnimation: () => void;
export declare const registerPie3dAnimation: () => void;
