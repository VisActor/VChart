import type { IAnimationConfig } from '@visactor/vgrammar-core';
import type { MarkAnimationSpec, IAnimationState } from './interface';
import type { IStateAnimateSpec, IAnimationSpec, IMorphSeriesSpec } from './spec';
import type { SeriesMarkNameEnum } from '../series/interface/type';
export declare const AnimationStates: string[];
export declare function animationConfig<Preset extends string>(
  defaultConfig?: MarkAnimationSpec,
  userConfig?: Partial<
    Record<IAnimationState, boolean | IStateAnimateSpec<Preset> | IAnimationConfig | IAnimationConfig[]>
  >,
  params?: {
    dataIndex: (datum: any) => number;
  }
): MarkAnimationSpec;
export declare function userAnimationConfig<M extends string, Preset extends string>(
  markName: SeriesMarkNameEnum | string,
  spec: IAnimationSpec<M, Preset>
): {
  appear: any;
  disappear: any;
  enter: any;
  exit: any;
  update: any;
  normal: any;
};
export declare function shouldDoMorph(
  hasAnimation: boolean,
  morphConfig?: IMorphSeriesSpec,
  animationConfig?: ReturnType<typeof userAnimationConfig>
): boolean;
export declare function isTimeLineAnimation(animationConfig: IAnimationConfig): boolean;
export declare function isChannelAnimation(animationConfig: IAnimationConfig): boolean;
