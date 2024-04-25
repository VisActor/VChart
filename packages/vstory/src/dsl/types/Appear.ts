import { Datum } from './Datum';

export interface AppearAction {
  action: 'add';
  data: Datum;
  startTime: number;
  payload: {
    animation: {
      effect: 'grow' | 'fade' | 'bounce';
      duration: number;
      oneByOne: boolean;
      easing: string;
      loop: boolean;
    };
  };
}

export type AppearOption = Omit<AppearAction, 'action' | 'data'>;
