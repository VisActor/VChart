import { StoryChartComponentType } from '../constant';
import { Datum } from './Datum';

export interface StyleOption {
  animation: {
    duration: number;
    easing: string;
  };
}

export interface StylePayload {
  [key: string]: number | string;
}

export interface StyleAction {
  action: 'add';
  data: Datum;
  elementId: number;
  elementType: StoryChartComponentType;
  payload: StylePayload;
  option: StyleOption;
}
