import type { IAction, IActionPayload } from '../index';
import type { Datum } from '../Datum';

export interface IChartUpdatePayload extends IActionPayload {
  data: Array<{
    sourceValue: Datum;
    targetValue: Datum;
  }>;
  id: string | number;
}

export interface IChartUpdateAction extends IAction {
  action: 'update';
  payload: IChartUpdatePayload;
}
