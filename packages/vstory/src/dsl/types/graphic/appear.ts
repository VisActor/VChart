import type { IAction, IAnimationParams, IActionPayload } from '../index';

export interface IGraphicAppearPayLoad extends IActionPayload {
  animation: Omit<IAnimationParams, 'loop'> & {
    effect: string; // TODO: 枚举类型
  };
}

export interface IGraphicAppearAction extends IAction {
  action: 'appear';
  payload: IGraphicAppearPayLoad;
}
