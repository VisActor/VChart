import { StoryChartType, StoryGraphicType } from '../constant';
import { addProcessor } from './vchart/add';
import { updateStyleProcessor } from './vchart/updateStyle';
import { updateProcessor } from './vchart/update';
import { rectAppearProcessor } from './graphic/appear';
import { appearProcessor } from './vchart/appear';

export const processorMap = {
  [StoryChartType.BAR]: {
    add: addProcessor,
    updateStyle: updateStyleProcessor,
    appear: appearProcessor
  },
  [StoryChartType.LINE]: {
    add: addProcessor,
    updateStyle: updateStyleProcessor,
    appear: appearProcessor
  },
  [StoryChartType.PIE]: {
    add: addProcessor,
    update: updateProcessor
  },
  [StoryGraphicType.RECT]: {
    appear: rectAppearProcessor
  }
};
