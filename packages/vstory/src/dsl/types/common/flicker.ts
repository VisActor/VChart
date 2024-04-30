import type { IAction, IActionPayload } from '../index';
import type { IAnimationParams } from './index';

export interface IFlickerParams extends IAnimationParams {
  frequency?: number;
}

export interface IFlickerPayload extends IActionPayload {
  animation: IFlickerParams;
}

export interface IFlickerAction extends IAction {
  action: 'flicker';
  payload: IFlickerPayload;
}
