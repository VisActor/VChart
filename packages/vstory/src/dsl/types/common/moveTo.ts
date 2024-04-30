import type { IAction, IActionPayload } from '../index';

// TODO: 后续可以增加参数 path: 指定移动的方式或路径类型，例如直线移动、曲线移动等。
export interface IMoveToAction extends IAction {
  action: 'moveTo';
  destination: { x: number; y: number };
  payload: IActionPayload;
}
