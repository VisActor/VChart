import type { IAction, IActionPayload } from '../index';
import type { IAnimationParams } from './index';

export interface IBrightenParams extends IAnimationParams {
  /**
   * @default 1.2
   */
  ratio?: number;
}

export interface IBrightenPayload extends IActionPayload {
  animation: IBrightenParams;
}

export interface IBrightenAction extends IAction {
  action: 'brighten';
  payload: IBrightenPayload;
}
