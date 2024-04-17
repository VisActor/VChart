import { Datum } from './Datum';

export interface UpdateStyleAction {
  action: 'updateStyle';
  data: Datum;
  payload: {
    style: {
      [key: string]: number | string;
    };
    animation: {
      duration: number;
      easing: string;
    };
  };
}

export type UpdateStyleOption = Omit<UpdateStyleAction, 'action' | 'data'>;
