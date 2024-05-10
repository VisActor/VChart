import { addProcessor } from '../vchart/add';
import { createMarkStyleProcessorByMarkType } from '../vchart/style/style';
import { updateProcessor } from '../vchart/update';
import { scatterAppearProcessor, scatterDisappearProcessor } from '../vchart/charts';
import { createMarkPointProcessor } from '../vchart/markPoint';
import { createTitleProcessor } from '../vchart/title';
import { bounceProcessor } from '../vchart/bounce';
import { symbolAppearProcessor } from '../vchart/marks';

export const scatterProcessorMap = {
  add: addProcessor,
  addPatch: addProcessor,
  updateProcessor,

  bounce: bounceProcessor,

  createMarkPoint: createMarkPointProcessor,
  createTitle: createTitleProcessor,

  appear: symbolAppearProcessor,
  disappear: scatterDisappearProcessor,
  symbolStyle: createMarkStyleProcessorByMarkType('symbol')
};
