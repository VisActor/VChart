import { addProcessor } from '../vchart/add';
import { createMarkStyleProcessorByMarkType } from '../vchart/style/style';
import { updateProcessor } from '../vchart/update';
import { sunburstDisappearProcessor, sunburstAppearProcessor } from '../vchart/charts';
import { createMarkPointProcessor } from '../vchart/markPoint';
import { createTitleProcessor } from '../vchart/title';
import { bounceProcessor } from '../vchart/bounce';

export const sunburstProcessorMap = {
  add: addProcessor,
  addPatch: addProcessor,
  updateProcessor,

  bounce: bounceProcessor,

  createMarkPoint: createMarkPointProcessor,
  createTitle: createTitleProcessor,

  appear: sunburstAppearProcessor,
  disappear: sunburstDisappearProcessor,
  symbolStyle: createMarkStyleProcessorByMarkType('symbol')
};
