import { Datum } from '../Datum';
import { IAction, IActionPayload } from '../index';

export interface IChartStylePayload extends IActionPayload {
  data: Datum;
  [key: string]: any;
}

export interface IChartStyleAction extends IAction {
  action: 'style';
  payload: IChartStylePayload;
}
