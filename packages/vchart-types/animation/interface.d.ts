export type { MarkAnimationSpec } from '@visactor/vgrammar-core';
import type { ICompilable } from '../compile/interface';
export declare enum AnimationStateEnum {
  appear = 'appear',
  disappear = 'disappear',
  enter = 'enter',
  update = 'update',
  state = 'state',
  exit = 'exit',
  normal = 'normal',
  none = 'none'
}
export type IAnimationState = keyof typeof AnimationStateEnum;
export interface IAnimateState {
  animationState: {
    callback: (datum: any, element: any) => AnimationStateEnum;
  };
}
export interface IAnimate extends ICompilable {
  id: number;
  updateAnimateState: (state: AnimationStateEnum, noRender?: boolean) => void;
  getAnimationStateSignalName: () => string;
}
export interface ICartesianGroupAnimationParams {
  direction: () => 'x' | 'y';
  orient: () => 'positive' | 'negative';
  width: () => number;
  height: () => number;
}
