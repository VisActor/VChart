import type { IAction, IActionPayload } from '../index';
import type { IAnimationParams } from './index';

export interface IBounceParams extends IAnimationParams {
  /**
   * 自定义弹跳 easing
   */
  customEase?: (ratio: number) => number;
  /**
   * 跳跃高度
   */
  dy?: number;
}

export interface IBouncePayload extends IActionPayload {
  animation: IBounceParams;
}

export interface IBounceAction extends IAction {
  action: 'bounce';
  payload: IBouncePayload;
}
