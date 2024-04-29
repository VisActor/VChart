import { IAction, IActionPayload } from '../index';
import { Datum } from '../Datum';

export interface IChartAddPayload extends IActionPayload {
  id: string | number;
  values: Datum | Datum[];
  style?: {
    [key: string]: number | string;
  };
}

export interface IChartAddAction extends IAction {
  action: 'add';
  payload: IChartAddPayload;
}
