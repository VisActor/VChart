import { Datum } from './Datum';

export interface UpdateStyleAction {
  action: 'updateStyle';
  data: Datum;
  style: {
    [key: string]: number | string;
  };
  animation: {
    duration: number;
    easing: string;
  };
}

export type UpdateStyleOption = Omit<UpdateStyleAction, 'action' | 'data'>;
