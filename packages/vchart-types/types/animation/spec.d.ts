import type { IAnimationConfig, IStateAnimationConfig } from '@visactor/vgrammar-core';
import type { EasingType } from '@visactor/vrender-core';
export type { IRunningConfig as IMorphConfig, IMorphAnimationConfig } from '@visactor/vgrammar-core';
export interface ICommonStateAnimateSpec {
    duration?: number;
    delay?: number;
    easing?: EasingType;
    oneByOne?: boolean;
}
export interface IStateAnimateSpec<Preset extends string> extends ICommonStateAnimateSpec {
    preset?: Preset | false;
}
export type IMarkAnimateSpec<MarkName extends string> = Partial<Record<MarkName, false | IAnimationConfig | IAnimationConfig[]>>;
export interface IAnimationSpec<MarkName extends string, Preset extends string> {
    animationAppear?: boolean | IStateAnimateSpec<Preset> | IMarkAnimateSpec<MarkName>;
    animationEnter?: boolean | ICommonStateAnimateSpec | IMarkAnimateSpec<MarkName>;
    animationUpdate?: boolean | ICommonStateAnimateSpec | IMarkAnimateSpec<MarkName>;
    animationExit?: boolean | ICommonStateAnimateSpec | IMarkAnimateSpec<MarkName>;
    animationDisappear?: boolean | ICommonStateAnimateSpec | IMarkAnimateSpec<MarkName>;
    animationState?: boolean | IStateAnimationConfig;
    animationNormal?: IMarkAnimateSpec<MarkName>;
}
export interface IMorphSeriesSpec {
    enable?: boolean;
    morphKey?: string;
    morphElementKey?: string;
}
