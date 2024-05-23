import type { IAction, IActionPayload } from '../index';
import type { Datum } from '../Datum';

export interface IChartUpdatePayload extends IActionPayload {
  data: Datum;
  id: string | number;
  value: Datum;
}

export interface IChartUpdateAction extends IAction {
  action: 'update';
  payload: IChartUpdatePayload;
}
