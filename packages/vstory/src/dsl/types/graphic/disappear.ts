import type { IAction, IAnimationParams, IActionPayload } from '../index';

export interface IGraphicDisappearPayLoad extends IActionPayload {
  animation: Omit<IAnimationParams, 'loop'> & {
    effect: string; // TODO: 枚举类型
  };
}

export interface IGraphicDisappearAction extends IAction {
  action: 'disappear';
  payload: IGraphicDisappearPayLoad;
}
