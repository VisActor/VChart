import { StoryChartComponentType, StoryChartType, StoryGraphicType } from '../constant';

import { addProcessor } from './vchart/add';
import { updateStyleProcessor } from './vchart/updateStyle';
import { updateProcessor } from './vchart/update';
import { qipaoAppearProcessor, rectAppearProcessor } from './graphic/appear';
import { appearProcessor } from './vchart/appear';
import { markPointProcessor, markPointFlickerProcessor } from './vchart/markPoint';

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
  },
  [StoryGraphicType.QIPAO]: {
    appear: qipaoAppearProcessor
  },
  [StoryChartType.AREA]: {
    add: addProcessor,
    addPatch: addProcessor,
    update: updateProcessor,
    markPoint: markPointProcessor
  }
};

export const componentProcessorMap = {
  [StoryChartComponentType.MARK_POINT]: {
    flicker: markPointFlickerProcessor
  }
};
