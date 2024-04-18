import { StoryChartComponentType, StoryChartType, StoryGraphicType } from '../constant';
import { addProcessor, addPatchParser } from './vchart/add';
import { updateStyleProcessor } from './vchart/updateStyle';
import { updateProcessor } from './vchart/update';
import { rectAppearProcessor } from './graphic/appear';
import { appearProcessor } from './vchart/appear';
import { markPointProcessor, markPointFlickerProcessor } from './vchart/markPoint';

export const processorMap = {
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
  },
  [StoryChartType.AREA]: {
    add: addProcessor,
    addPatch: addPatchParser,
    update: updateProcessor,
    markPoint: markPointProcessor
  }
};

export const componentProcessorMap = {
  [StoryChartComponentType.MARK_POINT]: {
    flicker: markPointFlickerProcessor
  }
};
