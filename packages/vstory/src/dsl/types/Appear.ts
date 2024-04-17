import { Datum } from './Datum';

export interface AppearAction {
  action: 'add';
  data: Datum;
  startTime: number;
  payload: {
    animation: {
      effect: string;
      duration: number;
      easing: string;
    };
  };
}

export type AppearOption = Omit<AppearAction, 'action' | 'data'>;
