import type { IElement } from '@visactor/vgrammar-core';
import type { IMark } from '../mark/interface';
import type { RenderMode } from '../typings/spec/common';
import type { BaseEventParams, IEventDispatcher, EventType } from '../event/interface';
import type { IModel } from '../model/interface';
import type { StateValue } from '../compile/mark';

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

  setDisableActiveEffect: (disable: boolean) => void;
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

type Trigger = EventType | EventType[];

export type IHoverSpec = {
  enable?: boolean;
  trigger?: Trigger;
  triggerOff?: Trigger;
};

export type ISelectSpec = {
  enable?: boolean;
  mode?: 'single' | 'multiple';
  trigger?: Trigger;
  triggerOff?: Trigger;
};

export interface ITriggerSpec {
  hover?: IHoverSpec | boolean;
  select?: ISelectSpec | boolean;
}
