import type { IAnimationConfig } from '@visactor/vgrammar-core';
import type { MarkAnimationSpec, IAnimationState } from './interface';
import type { IStateAnimateSpec, IAnimationSpec } from './spec';
import type { SeriesMarkNameEnum } from '../series/interface/type';
import type { ISeries } from '../series';
import type { ISeriesSpec } from '../typings';
import type { ISeriesMarkAttributeContext } from '../compile/mark';
export declare const AnimationStates: string[];
export declare function animationConfig<Preset extends string>(defaultConfig?: MarkAnimationSpec, userConfig?: Partial<Record<IAnimationState, boolean | IStateAnimateSpec<Preset> | IAnimationConfig | IAnimationConfig[]>>, params?: {
    dataIndex: (datum: any) => number;
    dataCount: () => number;
}): MarkAnimationSpec;
export declare function userAnimationConfig<M extends string, Preset extends string>(markName: SeriesMarkNameEnum | string, spec: IAnimationSpec<M, Preset>, ctx: ISeriesMarkAttributeContext): Partial<Record<"none" | "normal" | "state" | "update" | "appear" | "enter" | "exit" | "disappear", boolean | IAnimationConfig | IAnimationConfig[] | IStateAnimateSpec<string>>>;
export declare function shouldMarkDoMorph(spec: ISeriesSpec & IAnimationSpec<string, string>, markName: string): boolean;
export declare function isTimeLineAnimation(animationConfig: IAnimationConfig): boolean;
export declare function isChannelAnimation(animationConfig: IAnimationConfig): boolean;
export declare function uniformAnimationConfig<Preset extends string>(config: Partial<Record<IAnimationState, boolean | IStateAnimateSpec<Preset> | IAnimationConfig | IAnimationConfig[]>>, ctx: ISeriesMarkAttributeContext): Partial<Record<"none" | "normal" | "state" | "update" | "appear" | "enter" | "exit" | "disappear", boolean | IAnimationConfig | IAnimationConfig[] | IStateAnimateSpec<Preset>>>;
export declare function isAnimationEnabledForSeries(series: ISeries): boolean;
