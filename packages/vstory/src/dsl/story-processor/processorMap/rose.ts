import { StoryChartComponentType, StoryChartType, StoryGraphicType } from '../../constant';

import { addProcessor } from '../vchart/add';
import { createMarkStyleProcessorByMarkType } from '../vchart/style/style';
import { updateProcessor } from '../vchart/update';
import { createMarkPointProcessor } from '../vchart/markPoint';
import { createTitleProcessor } from '../vchart/title';

import { bounceProcessor } from '../vchart/bounce';
import { roseAppearProcessor, roseDisappearProcessor } from '../vchart/charts/rose';

export const roseProcessorMap = {
  add: addProcessor,
  addPatch: addProcessor,
  updateProcessor,

  bounce: bounceProcessor,

  createMarkPoint: createMarkPointProcessor,
  createTitle: createTitleProcessor,

  appear: roseAppearProcessor,
  disappear: roseDisappearProcessor,
  arcStyle: createMarkStyleProcessorByMarkType('arc')
};
