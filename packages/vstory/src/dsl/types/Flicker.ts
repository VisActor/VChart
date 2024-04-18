import { StoryChartComponentType } from '../constant';

export interface FlickerAction {
  action: 'flicker';
  elementId: number;
  elementType: StoryChartComponentType;
  payload?: {
    animation: {
      duration: number;
    };
  };
}

export type FlickerOption = Omit<FlickerAction, 'action' | 'elementId' | 'elementType'>;
