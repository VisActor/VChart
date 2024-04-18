import { StoryChartComponentType, StoryChartType, StoryGraphicType } from '../../constant';

import { addProcessor } from '../vchart/add';
import { createMarkStyleProcessorByMarkType } from '../vchart/updateStyle';
import { updateProcessor } from '../vchart/update';
import { qipaoAppearProcessor, rectAppearProcessor } from '../graphic/appear';
import { appearProcessor } from '../vchart/appear';
import { createMarkPointProcessor, markPointFlickerProcessor } from '../vchart/markPoint';
import { createTitleProcessor } from '../vchart/title';

/**
 * 通用的编辑processor
 */
const editProcessor = {
  add: addProcessor,
  addPatch: addProcessor,
  updateProcessor
};

/**
 * 通用的查看processor
 */
const viewProcessor = {
  appear: appearProcessor
};

/**
 * 通用的组件行为processor
 */

const componentProcessor = {
  createMarkPoint: createMarkPointProcessor,
  createTitle: createTitleProcessor
};

// 图表processor
export const processorChartMap = {
  [StoryChartType.BAR]: {
    // 大多数都是通用的, 可以复用.
    ...editProcessor,
    ...viewProcessor,
    // 通用的, 但实现不同的, 可以直接覆盖
    add: addProcessor,
    appear: appearProcessor,
    createMarkPoint: createMarkPointProcessor,
    createTitle: createTitleProcessor,
    // 不通用的, 可直接覆盖, 重新定义
    barStyle: createMarkStyleProcessorByMarkType('rect')
  },
  [StoryChartType.LINE]: {
    ...editProcessor,
    ...viewProcessor,
    ...componentProcessor,
    lineStyle: createMarkStyleProcessorByMarkType('line'),
    symbolStyle: createMarkStyleProcessorByMarkType('symbol')
  },
  [StoryChartType.PIE]: {
    ...editProcessor,
    ...viewProcessor,
    ...componentProcessor,
    arcStyle: createMarkStyleProcessorByMarkType('arc')
  },
  [StoryChartType.AREA]: {
    ...editProcessor,
    ...viewProcessor,
    ...componentProcessor,
    arcStyle: createMarkStyleProcessorByMarkType('arc')
  }
};

// 组件processor
export const processorComponentMap = {
  [StoryChartComponentType.MARK_POINT]: {
    flicker: markPointFlickerProcessor
  }
};

// 图元processor
export const processorMarkMap = {
  [StoryGraphicType.RECT]: {
    appear: rectAppearProcessor
  },
  [StoryGraphicType.QIPAO]: {
    appear: qipaoAppearProcessor
  }
};

// TODO: 按需引用, 所有processor
export const processorMap = {
  ...processorChartMap,
  ...processorComponentMap,
  ...processorMarkMap
};
