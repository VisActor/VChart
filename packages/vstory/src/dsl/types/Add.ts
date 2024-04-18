import { Datum } from './Datum';

export interface AddOption {
  style: {
    [key: string]: number | string;
  };
  animation: {
    duration: number;
    easing: string;
  };
}

export interface AddPayload {
  id: string | number;
  data: Datum | Datum[];
}

export interface AddAction extends AddOption {
  action: 'add';
  payload: AddPayload;
}
