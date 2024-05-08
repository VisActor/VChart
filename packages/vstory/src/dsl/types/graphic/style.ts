import { IAction, IActionPayload } from '../index';

export interface IGraphicStylePayload extends IActionPayload {
  graphic?: Record<string, any>;
  text?: Record<string, any>;
}

export interface IGraphicStyleAction extends IAction {
  action: 'style';
  payload: IGraphicStylePayload;
}
