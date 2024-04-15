import { StoryChartType } from '../constant';
import { addParser } from './edit-processor/add';
import { updateStyleParser } from './view-processor/updateStyle';

export const processorMap = {
  [StoryChartType.BAR]: {
    add: addParser,
    updateStyle: updateStyleParser
  }
};
