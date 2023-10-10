import { isEmpty } from '@visactor/vutils';
import type { StateValue } from '../compile/mark';
import type { IElement } from '@visactor/vgrammar-core';
import type { BaseEventParams } from '../event/interface';
import type { IMark } from '../mark/interface';
import type { IInteraction } from './interface';
import { stateToReverse } from '../compile/mark/util';

export class Interaction implements IInteraction {
  // 数据
  private _stateMarks: Map<StateValue, IMark[]> = new Map();
  // active
  private _stateElements: Map<StateValue, IElement[]> = new Map();

  static markStateEnable(mark: IMark, state: string) {
    return !isEmpty(mark.stateStyle[state]);
  }

  private _disableTriggerEvent: boolean = false;

  setDisableActiveEffect(disable: boolean) {
    this._disableTriggerEvent = disable;
  }

  registerMark(state: StateValue, mark: IMark): void {
    if (!this._stateMarks.has(state)) {
      this._stateMarks.set(state, []);
    }
    this._stateMarks.get(state)?.push(mark);
  }

  getStateMark(state: StateValue): IMark[] | null {
    return this._stateMarks.get(state);
  }

  filterEventMark(params: BaseEventParams, state: StateValue): boolean {
    return !!(params.mark && this._stateMarks.get(state)?.includes(params.mark));
  }

  getEventElement(stateValue: StateValue) {
    return this._stateElements.get(stateValue) ?? [];
  }

  getEventElementData(stateValue: StateValue) {
    return this.getEventElement(stateValue).map(e => e.getDatum());
  }

  exchangeEventElement(stateValue: StateValue, element: IElement) {
    if (this._disableTriggerEvent) {
      return;
    }
    // reverse
    const reState = stateToReverse(stateValue);
    this._stateElements.get(stateValue)?.forEach(e => {
      e.removeState(stateValue);
      if (reState) {
        this.addEventElement(reState, e);
      }
    });
    if (!element.getStates().includes(stateValue)) {
      element.addState(stateValue);
      if (reState) {
        element.removeState(reState);
      }
    }
    this._stateElements.set(stateValue, [element]);
  }

  removeEventElement(stateValue: StateValue, element: IElement) {
    if (this._disableTriggerEvent) {
      return;
    }
    element.removeState(stateValue);
    const list = this._stateElements.get(stateValue)?.filter(e => e !== element) ?? [];
    this._stateElements.set(stateValue, list);
    // reverse
    const reState = stateToReverse(stateValue);
    if (reState) {
      if (list.length === 0) {
        // clear reverse
        this.clearEventElement(reState, false);
      } else {
        // add reverse to element
        this.addEventElement(reState, element);
      }
    }
  }

  addEventElement(stateValue: StateValue, element: IElement) {
    if (this._disableTriggerEvent) {
      return;
    }
    if (!element.getStates().includes(stateValue)) {
      element.addState(stateValue);
    }
    const list = this._stateElements.get(stateValue) ?? [];
    list.push(element);
    this._stateElements.set(stateValue, list);
  }

  clearEventElement(stateValue: StateValue, clearReverse: boolean) {
    if (this._disableTriggerEvent) {
      return;
    }
    this._stateElements.get(stateValue)?.forEach(e => {
      e.removeState(stateValue);
    });
    this._stateElements.set(stateValue, []);

    if (clearReverse) {
      const reState = stateToReverse(stateValue);
      if (reState) {
        this.clearEventElement(reState, false);
      }
    }
  }

  /**
   * 激活交互元素时 进行反选
   * 需要先将元素添加到已交互状态再使用此方法反选
   * @param stateValue
   * @param activeElement
   * @returns
   */
  reverseEventElement(stateValue: StateValue) {
    if (this._disableTriggerEvent) {
      return;
    }
    // TODO:直接加默认后缀？or再增加一个map？
    const state = stateToReverse(stateValue);
    if (!state) {
      return;
    }
    const marks = this.getStateMark(state);
    if (!marks) {
      return;
    }
    const activeElements = this.getEventElement(stateValue);
    if (!activeElements.length) {
      return;
    }
    const currentReverse = this.getEventElement(state);
    if (!currentReverse.length) {
      // all
      // for performance array.include
      // FIXME: 也许并没有太大必要
      if (activeElements.length === 1) {
        marks.forEach(m => {
          m.getProduct()
            .elements.filter(e => e !== activeElements[0])
            .forEach(e => {
              this.addEventElement(state, e);
            });
        });
      } else {
        marks.forEach(m => {
          m.getProduct()
            .elements.filter(e => !activeElements.includes(e))
            .forEach(e => {
              this.addEventElement(state, e);
            });
        });
      }
    }
  }
}
