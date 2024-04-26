import { Datum } from './Datum';

export interface AppearAction {
  action: 'add';
  data: Datum;
  startTime: number;
  payload: {
    animation: {
      /**
       * 柱状图支持: 'grow' | 'fade' | 'bounce'
       * 折线图支持: 'grow' | 'fade'
       * 饼图支持: 'grow' | 'fade' | 'growAngle' | 'growRadius'
       */
      effect: 'grow' | 'fade' | 'bounce' | 'growAngle' | 'growRadius';
      duration: number;
      oneByOne: boolean;
      easing: string;
      loop: boolean;
    };
  };
}

export type AppearOption = Omit<AppearAction, 'action' | 'data'>;
