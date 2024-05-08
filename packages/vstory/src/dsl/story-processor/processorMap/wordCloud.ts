import { addProcessor } from '../vchart/add';
import { createMarkStyleProcessorByMarkType } from '../vchart/style/style';
import { updateProcessor } from '../vchart/update';
import { wordCloudAppearProcessor, wordCloudDisappearProcessor } from '../vchart/appear';
import { createMarkPointProcessor } from '../vchart/markPoint';
import { createTitleProcessor } from '../vchart/title';
import { bounceProcessor } from '../vchart/bounce';

export const wordCloudProcessorMap = {
  add: addProcessor,
  addPatch: addProcessor,
  updateProcessor,

  bounce: bounceProcessor,

  createMarkPoint: createMarkPointProcessor,
  createTitle: createTitleProcessor,

  appear: wordCloudAppearProcessor,
  disappear: wordCloudDisappearProcessor,
  symbolStyle: createMarkStyleProcessorByMarkType('symbol')
};
