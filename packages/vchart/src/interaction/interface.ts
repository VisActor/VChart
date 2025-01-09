import type {
  ElementActiveByLegendSpec,
  ElementActiveSpec,
  ElementHighlightByGroupSpec,
  ElementHighlightByKeySpec,
  ElementHighlightByLegendSpec,
  ElementHighlightByNameSpec,
  ElementHighlightSpec,
  ElementSelectSpec,
  IElement,
  IInteraction as IVGrammarInteraction
} from '@visactor/vgrammar-core';
import type { IMark } from '../mark/interface';
import type { RenderMode } from '../typings/spec/common';
import type { BaseEventParams, IEventDispatcher, EventType } from '../event/interface';
import type { IModel } from '../model/interface';
import type { StateValue } from '../compile/mark/interface';
import type { StringOrNumber } from '../typings/common';

export interface IInteraction {
  registerMark: (state: StateValue, mark: IMark) => void;
  filterEventMark: (params: BaseEventParams, state: StateValue) => boolean;
  getStateMark: (state: StateValue) => IMark[] | null;

  getEventElement: (stateValue: StateValue) => IElement[];
  getEventElementData: (stateValue: StateValue) => any[];
  addEventElement: (stateValue: StateValue, element: IElement) => void;
  removeEventElement: (stateValue: StateValue, elements: IElement) => void;
  exchangeEventElement: (stateValue: StateValue, elements: IElement) => void;
  clearEventElement: (stateValue: StateValue, clearReverse: boolean) => void;
  reverseEventElement: (stateValue: StateValue) => void;
  clearAllEventElement: () => void;

  setDisableActiveEffect: (disable: boolean) => void;
  addVgrammarInteraction: (state: StateValue, i: IVGrammarInteraction) => void;
  startInteraction: (state: StateValue, element: IElement) => void;
  resetInteraction: (state: StateValue, element: IElement) => void;
  resetAllInteraction: () => void;
}

export interface ITrigger {
  init: () => void;
  setStateKeys: (fields: string[]) => void;
  registerMark: (mark: IMark) => void;
  release: () => void;
  hover?: IHoverSpec;
  select?: ISelectSpec;
}

export interface ITriggerOption {
  mode: RenderMode;
  interaction: IInteraction;
  eventDispatcher: IEventDispatcher;
  model: IModel;
}

export interface IBaseInteractionSpec {
  /**
   * 触发交互的图元id
   */
  markIds?: StringOrNumber[];
  /**
   * 触发交互的图元名称
   */
  markNames?: StringOrNumber[];
}

type Trigger = EventType | EventType[];

/**
 * hover 交互详细配置内容
 */
export interface IHoverSpec extends IBaseInteractionSpec {
  /**
   * hover 交互开关，默认开启
   */
  enable?: boolean;
  /**
   * hover 交互的触发事件配置
   */
  trigger?: Trigger;
  /**
   * hover 交互的终止事件配置
   */
  triggerOff?: Trigger;
}

/**
 * select 交互详细配置内容
 */
export interface ISelectSpec extends IBaseInteractionSpec {
  /**
   * select 交互开关，默认开启。
   */
  enable?: boolean;
  /**
   * 选中模式配置，默认 single 单选
   */
  mode?: 'single' | 'multiple';
  /**
   * select 交互的触发事件配置
   */
  trigger?: Trigger;
  /**
   * select 交互的终止事件配置
   */
  triggerOff?: Trigger | number;
}

/**
 * 将触发元素的状态设置为激活状态，当开启这个交互的时候，可以在系列图元通过 `state.active` 设置激活状态下的视觉编码
 */
export type IElementActiveSpec = IBaseInteractionSpec &
  Pick<ElementActiveSpec, 'type' | 'trigger' | 'triggerOff' | 'state'>;

/**
 * 图元选中相关交互，当开启这个交互的时候，
 * 可以在系列图元通过 `state.selected` 设置激活状态下的视觉编码
 * 可以在系列图元通过 `state.selected_reverse` 设置非激活状态下的视觉编码
 */
export type IElementSelectSpec = IBaseInteractionSpec &
  Pick<ElementSelectSpec, 'type' | 'trigger' | 'triggerOff' | 'state' | 'isMultiple' | 'reverseState'>;
/**
 * 图元高亮交互配置，当开启这个交互的时候，
 * 可以在系列图元通过 `state.highlight` 设置激活状态下的视觉编码
 * 可以在系列图元通过 `state.blur` 设置非激活状态下的视觉编码
 */
export type IElementHighlightSpec = IBaseInteractionSpec &
  Pick<ElementHighlightSpec, 'type' | 'blurState' | 'highlightState' | 'triggerOff' | 'trigger'>;
/**
 * 将触发元素以及和触发元素具有相同key的元素状态设置为高亮状态，其他元素的状态设置为失焦状态；一般需要配合系列的dataKey 配置使用
 */
export type IElementHighlightByKeySpec = IBaseInteractionSpec &
  Pick<ElementHighlightByKeySpec, 'type' | 'blurState' | 'highlightState' | 'triggerOff' | 'trigger'>;
/**
 * 将触发元素以及和触发元素具有相同分组值（groupKey）的元素状态设置为高亮状态，其他元素的状态设置为失焦状态
 */
export type IElementHighlightByGroup = IBaseInteractionSpec &
  Pick<ElementHighlightByGroupSpec, 'type' | 'blurState' | 'highlightState' | 'triggerOff' | 'trigger'>;
/**
 * 根据图例激活图元，默认触发事件为图例的 `legendItemHover`和`legendItemUnHover`事件
 */
export type IElementActiveByLegend = IBaseInteractionSpec &
  Pick<ElementActiveByLegendSpec, 'type' | 'filterType' | 'state'>;
/**
 * 根据图例高亮图元，默认触发事件为图例的 `legendItemHover`和`legendItemUnHover`事件
 */
export type IElementHighlightByLegend = IBaseInteractionSpec &
  Pick<ElementHighlightByLegendSpec, 'type' | 'filterType' | 'blurState' | 'highlightState'>;
/**
 * 根据图例高亮图元，默认触发事件为图例的 `legendItemHover`和`legendItemUnHover`事件
 */
export type IElementHighlightByName = IBaseInteractionSpec &
  Pick<ElementHighlightByNameSpec, 'type' | 'blurState' | 'highlightState' | 'graphicName' | 'parseData'>;

/**
 * 元素选中交互，将所有相同名称的元素的状态设置为选中状态；注意该交互不建议和默认的select交互同时使用（象形图除外）
 */
export interface ICustomInteraction extends IBaseInteractionSpec {
  type: string;
}

/**
 * 交互相关配置，目前支持的交互类型包括：
 * - 元素激活
 * - 元素选中
 * - 元素高亮
 * - 根据key值高亮元素
 * - 根据group值高亮元素
 * - 根据legend值激活元素
 * - 根据legend值高亮元素
 * - 根据图元名称高亮元素
 */
export type IInteractionItemSpec =
  | IElementActiveSpec
  | IElementSelectSpec
  | IElementHighlightSpec
  | IElementHighlightByKeySpec
  | IElementHighlightByGroup
  | IElementActiveByLegend
  | IElementHighlightByLegend
  | IElementHighlightByName;

/**
 *  申明图表交互相关配置
 */
export interface IInteractionSpec {
  /**
   * 图表hover相关交互配置，当值为boolean类型时，表示开启或者关闭该交互
   * 也支持更详细的交互配置
   */
  hover?: IHoverSpec | boolean;
  /**
   * 图表选中相关交互配置，当值为boolean类型时，表示开启或者关闭该交互
   * 也支持更详细的交互配置
   */
  select?: ISelectSpec | boolean;
  /**
   * 其他需要按需注册的类型交互
   */
  interactions?: IInteractionItemSpec[];
}
