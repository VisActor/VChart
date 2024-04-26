import { StoryChartComponentType } from '../constant';
import { FlickerParams } from '../story-processor/graphic/effect/flicker';

export interface FlickerAction {
  action: 'flicker';
  elementId: number;
  elementType: StoryChartComponentType;
  payload?: {
    animation: FlickerParams;
  };
}

export type FlickerOption = Omit<FlickerAction, 'action' | 'elementId' | 'elementType'>;
