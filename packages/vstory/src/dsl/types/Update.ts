import { Datum } from './Datum';

export interface UpdateAction {
  action: 'add';
  data: Datum;
  payload: Datum;
}

export type UpdateOption = Omit<UpdateAction, 'action' | 'data'>;
