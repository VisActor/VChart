import { Datum } from './Datum';

export interface AddAction {
  action: 'add';
  data: Datum;
  style: {
    [key: string]: number | string;
  };
  animation: {
    duration: number;
    easing: string;
  };
}

export type AddOption = Omit<AddAction, 'action' | 'data'>;
