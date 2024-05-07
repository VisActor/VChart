import { StoryChartComponentType, StoryChartType, StoryGraphicType } from '../../constant';

import { addProcessor } from '../vchart/add';
import { createMarkStyleProcessorByMarkType } from '../vchart/style/style';
import { updateProcessor } from '../vchart/update';
import { graphicAppearProcessor, textAppearProcessor } from '../graphic/appear';
import {
  barAppearProcessor,
  barDisappearProcessor,
  lineAppearProcessor,
  areaAppearProcessor,
  areaDisappearProcessor,
  pieAppearProcessor,
  pieDisappearProcessor,
  scatterAppearProcessor,
  scatterDisappearProcessor
} from '../vchart/appear';
import { createMarkPointProcessor, markPointFlickerProcessor } from '../vchart/markPoint';
import { createTitleProcessor } from '../vchart/title';
import { lineStyleProcessor } from '../vchart/style/lineStyle';
import { danceProcessor } from '../vchart/dance';
import { flickerProcessor } from '../graphic/flicker';
import { darkenProcessor } from '../graphic/darken';
import { brightenProcessor } from '../graphic/brighten';
import { moveToProcessor } from '../graphic/moveTo';
import { styleProcessor } from '../graphic/style';
import { graphicDisappearProcessor, textDisappearProcessor } from '../graphic/disappear';
import { bounceProcessor } from '../vchart/bounce';
import { roseProcessorMap } from './rose';
import { scatterProcessorMap } from './scatter';
import { rangeColumnProcessorMap } from './rangeColumn';
import { radarProcessorMap } from './radar';
import { wordCloudProcessorMap } from './wordCloud';
import { sunburstProcessorMap } from './sunburst';
import { treeMapProcessorMap } from './treeMap';
/**
 * 通用的编辑processor
 */
export const editProcessor = {
  add: addProcessor,
  addPatch: addProcessor,
  updateProcessor
};

/**
 * 通用的查看processor
 */
export const viewProcessor = {
  bounce: bounceProcessor
};

/**
 * 通用的组件行为processor
 */

export const componentProcessor = {
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
    createMarkPoint: createMarkPointProcessor,
    createTitle: createTitleProcessor,
    // 不通用的, 可直接覆盖, 重新定义
    barStyle: createMarkStyleProcessorByMarkType('rect'),
    appear: barAppearProcessor,
    disappear: barDisappearProcessor,
    dance: danceProcessor
  },
  [StoryChartType.LINE]: {
    ...editProcessor,
    ...viewProcessor,
    ...componentProcessor,
    lineStyle: lineStyleProcessor,
    appear: lineAppearProcessor,
    symbolStyle: createMarkStyleProcessorByMarkType('symbol')
  },
  [StoryChartType.PIE]: {
    ...editProcessor,
    ...viewProcessor,
    ...componentProcessor,
    arcStyle: createMarkStyleProcessorByMarkType('arc'),
    appear: pieAppearProcessor,
    disappear: pieDisappearProcessor
  },
  [StoryChartType.AREA]: {
    ...editProcessor,
    ...viewProcessor,
    ...componentProcessor,
    appear: areaAppearProcessor,
    disappear: areaDisappearProcessor,
    arcStyle: createMarkStyleProcessorByMarkType('arc')
  },
  [StoryChartType.RANGE_COLUMN]: rangeColumnProcessorMap,
  [StoryChartType.SCATTER]: scatterProcessorMap,
  [StoryChartType.ROSE]: roseProcessorMap,
  [StoryChartType.RADAR]: radarProcessorMap,
  [StoryChartType.WORD_CLOUD]: wordCloudProcessorMap,
  [StoryChartType.TREE_MAP]: treeMapProcessorMap,
  [StoryChartType.SUNBURST]: sunburstProcessorMap,
  CharacterChart: {
    // TODO:  processor 需要重构一下结构。这里为了跑 demo
    ...viewProcessor
  }
};

// 组件processor
export const processorComponentMap = {
  [StoryChartComponentType.MARK_POINT]: {
    flicker: markPointFlickerProcessor
  }
};

// 图元processor
export const commonMarkProcessor = {
  appear: graphicAppearProcessor,
  disappear: graphicDisappearProcessor,
  flicker: flickerProcessor,
  darken: darkenProcessor,
  brighten: brightenProcessor,
  moveTo: moveToProcessor,
  style: styleProcessor,
  bounce: bounceProcessor
};

export const processorMarkMap = {
  [StoryGraphicType.RECT]: {
    ...commonMarkProcessor
  },
  [StoryGraphicType.QIPAO]: {
    ...commonMarkProcessor
  },
  [StoryGraphicType.TEXT]: {
    ...commonMarkProcessor,
    appear: textAppearProcessor,
    disappear: textDisappearProcessor
  },
  [StoryGraphicType.RICH_TEXT]: {
    ...commonMarkProcessor
  }
};

// TODO: 按需引用, 所有processor
export const processorMap = {
  ...processorChartMap,
  ...processorComponentMap,
  ...processorMarkMap
};
