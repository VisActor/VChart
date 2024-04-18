import { IMarkPointSpec } from '@visactor/vchart';
import { Datum } from './Datum';

export interface MarkPointAction {
  action: 'markPoint';
  data: Datum;
  payload?: {
    itemContent?: IMarkPointSpec['itemContent'];
    itemLine?: IMarkPointSpec['itemLine'];
    animation?: {
      duration: number;
      easing: string;
    };
  };
}

export type MarkPointOption = Omit<MarkPointAction, 'action' | 'data'>;

export interface MarkPointFlickerAction {
  action: 'flicker';
  element: string;
  payload?: {
    animation: {
      duration: number;
    };
  };
}

export type MarkPointFlickerOption = Omit<MarkPointFlickerAction, 'action'>;
