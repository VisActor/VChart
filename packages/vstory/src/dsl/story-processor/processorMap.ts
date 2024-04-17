import { StoryChartType } from '../constant';
import { addProcessor } from './vchart/add';
import { updateStyleProcessor } from './vchart/updateStyle';
import { updateProcessor } from './vchart/update';

export const processorMap = {
  [StoryChartType.BAR]: {
    add: addProcessor,
    updateStyle: updateStyleProcessor
  },
  [StoryChartType.PIE]: {
    add: addProcessor,
    update: updateProcessor
  }
};
