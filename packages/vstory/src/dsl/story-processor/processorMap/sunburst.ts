import { addProcessor } from '../vchart/add';
import { createMarkStyleProcessorByMarkType } from '../vchart/style/style';
import { updateProcessor } from '../vchart/update';
import { pieAppearProcessor, pieDisappearProcessor } from '../vchart/appear';
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

  appear: pieAppearProcessor,
  disappear: pieDisappearProcessor,
  symbolStyle: createMarkStyleProcessorByMarkType('symbol')
};
