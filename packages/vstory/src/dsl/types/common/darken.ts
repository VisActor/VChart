import type { IAction, IActionPayload } from '../index';
import type { IAnimationParams } from './index';

export interface IDarkenParams extends IAnimationParams {
  /**
   * @default 0.8
   */
  ratio?: number;
}

export interface IDarkenPayload extends IActionPayload {
  animation: IDarkenParams;
}

export interface IDarkenAction extends IAction {
  action: 'darken';
  payload: IDarkenPayload;
}
