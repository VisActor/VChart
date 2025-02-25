import type { ACustomAnimate, EasingType, IGraphic } from '@visactor/vrender-core';
import type { ICompilable } from '../compile/interface';
import type { IMark } from '../mark/interface/common';

export enum AnimationStateEnum {
  appear = 'appear',
  disappear = 'disappear',
  enter = 'enter',
  update = 'update',
  state = 'state',
  exit = 'exit',
  normal = 'normal',
  // for hack
  none = 'none'
}

export type IAnimationState = keyof typeof AnimationStateEnum;

export interface IAnimateState {
  animationState: { callback: (datum: any, element: any) => AnimationStateEnum };
}

export interface IAnimate extends ICompilable {
  id: number;
  updateAnimateState: (state: AnimationStateEnum, noRender?: boolean) => void;
  // TODO: animation control
  // pause: () => void;
  // resume: () => void;
}

export interface ICartesianGroupAnimationParams {
  direction: () => 'x' | 'y';
  orient: () => 'positive' | 'negative';
  width: () => number;
  height: () => number;
}

export interface IAnimationParameters {
  width: number;
  height: number;
  mark: IMark;
  group: IMark | null;
  elementIndex: number;
  elementCount: number;
  view: any;
}

export type IAnimationChannelInterpolator = (
  ratio: number,
  from: any,
  to: any,
  nextAttributes: any,
  datum: any,
  g: IGraphic,
  parameters: IAnimationParameters
) => boolean | void;

export type GraphicFunctionCallback<T> = (datum: any, g: IGraphic, params: any) => T;

export type GraphicFunctionValueType<T> = GraphicFunctionCallback<T> | T;

/**
 * state动画，暂时只支持简单配置
 */
export interface IStateAnimationConfig {
  /**
   * 状态动画的动画时长
   */
  duration?: number;
  /**
   * 状态动画的缓动函数类型
   */
  easing?: EasingType;
}

export interface IAnimationControlOptions {
  /** 当动画状态变更时清空动画 */
  stopWhenStateChange?: boolean;
  /** 是否立即应用动画初始状态 */
  immediatelyApply?: boolean;
  /** encode 计算图元最终状态时是否忽略循环动画 */
  ignoreLoopFinalAttributes?: boolean;
}

export interface CommonAnimationConfigItem {
  custom?: IAnimationChannelInterpolator | IAnimationCustomConstructor;
  customParameters?: GraphicFunctionValueType<any>;

  easing?: EasingType;
  duration?: GraphicFunctionValueType<number>;
  delay?: GraphicFunctionValueType<number>;
  delayAfter?: GraphicFunctionValueType<number>;
  oneByOne?: GraphicFunctionValueType<boolean | number>;
  startTime?: GraphicFunctionValueType<number>;
  totalTime?: GraphicFunctionValueType<number>;
  /** loop: true 无限循环; loop: 正整数，表示循环的次数 */
  loop?: boolean | number;
  /** 动画 effect 配置项 */
  options?: GraphicFunctionValueType<any>;
  /** 动画执行相关控制配置项 */
  controlOptions?: IAnimationControlOptions;
}

export interface TypeAnimationConfig extends CommonAnimationConfigItem {
  type: string;
}

export type IAnimationChannelFunction = (datum: any, g: IGraphic) => any;

export type IAnimationChannelAttrs = Record<
  string,
  {
    from?: any | IAnimationChannelFunction;
    to?: any | IAnimationChannelFunction;
  }
>;

export interface ChannelAnimationConfig extends CommonAnimationConfigItem {
  channel: IAnimationChannelAttrs | string[];
}

export type IAnimationTypeConfig = TypeAnimationConfig | ChannelAnimationConfig | CommonAnimationConfigItem;

export interface IAnimationCustomConstructor {
  new (from: any, to: any, duration: number, ease: EasingType, parameters?: any): ACustomAnimate<any>;
}

export type IAnimationEffect = {
  type?: string;
  channel?: IAnimationChannelAttrs | string[];
  custom?: IAnimationChannelInterpolator | IAnimationCustomConstructor;
  customParameters?: GraphicFunctionValueType<any>;
  easing?: EasingType;
  options?: GraphicFunctionValueType<any>;
};

export interface IAnimationTimeSlice {
  effects: IAnimationEffect | IAnimationEffect[];
  duration?: GraphicFunctionValueType<number>;
  delay?: GraphicFunctionValueType<number>;
  delayAfter?: GraphicFunctionValueType<number>;
}

export interface IAnimationTimeline {
  /** 为了方便动画编排，用户可以设置 id 用于识别时间线 */
  id?: string;
  /** 时间切片 */
  timeSlices: IAnimationTimeSlice | IAnimationTimeSlice[];
  /** 动画开始的相对时间，可以为负数 */
  startTime?: GraphicFunctionValueType<number>;
  /** 动画时长 */
  totalTime?: GraphicFunctionValueType<number>;
  /** 动画依次执行的延迟 */
  oneByOne?: GraphicFunctionValueType<number | boolean>;
  /** loop: true 无限循环; loop: 正整数，表示循环的次数 */
  loop?: GraphicFunctionValueType<number | boolean>;
  /** 对图元元素进行划分，和过滤类似，但是不同时间线不能同时作用在相同的元素上 */
  partitioner?: GraphicFunctionCallback<boolean>;
  /** 对同一时间线上的元素进行排序 */
  sort?: (datumA: any, datumB: any, graphicA: IGraphic, graphicB: IGraphic) => number;
  /** 动画执行相关控制配置项 */
  controlOptions?: IAnimationControlOptions;
}

export type IAnimationConfig = IAnimationTimeline | IAnimationTypeConfig;

export interface MarkAnimationSpec {
  appear?: IAnimationConfig | IAnimationConfig[];
  enter?: IAnimationConfig | IAnimationConfig[];
  exit?: IAnimationConfig | IAnimationConfig[];
  update?: IAnimationConfig | IAnimationConfig[];
  normal?: IAnimationConfig | IAnimationConfig[];
  state?: IStateAnimationConfig;
}
