import { Event } from '../event/event';
import { getDefaultInteractionConfigByMode } from './config';
import { isBoolean, isObject, array } from '@visactor/vutils';
import { mergeSpec } from '../util/spec/merge-spec';

import type { IMark } from '../mark/interface';
import type { BaseEventParams, EventCallback, EventParams, IEvent } from '../event/interface';
import type { IHoverSpec, IInteraction, ISelectSpec, ITrigger, ITriggerOption, ITriggerSpec } from './interface';
import type { RenderMode } from '../typings/spec';
import { MarkSet } from '../mark/mark-set';
import { STATE_VALUE_ENUM } from '../compile/mark/interface';
import { Event_Bubble_Level, Event_Source_Type } from '../constant';

export class Trigger implements ITrigger {
  // 事件
  readonly event: IEvent;

  protected readonly interaction: IInteraction;

  protected _spec: ITriggerSpec;
  protected _option: ITriggerOption;

  protected _hover: IHoverSpec;
  get hover() {
    return this._hover;
  }
  protected _select: ISelectSpec;
  get select() {
    return this._select;
  }

  protected _fields: string[] | null = null;
  protected _marks: MarkSet = new MarkSet();
  protected _markReverse: MarkSet = new MarkSet();
  private _isHovered?: boolean;

  constructor(spec: ITriggerSpec, option: ITriggerOption) {
    this._spec = spec;
    this._option = option;
    this.event = new Event(option.eventDispatcher, option.mode);
    this.interaction = option.interaction;
    this.initConfig(option.mode);
  }

  setStateKeys(fields: string[]): void {
    this._fields = fields.slice();
  }

  registerMark(mark: IMark): void {
    this._marks.addMark(mark);
    if (this._hover.enable) {
      this.interaction.registerMark(STATE_VALUE_ENUM.STATE_HOVER, mark);
    }
    if (this._select.enable) {
      this.interaction.registerMark(STATE_VALUE_ENUM.STATE_SELECTED, mark);
    }
  }

  init(): void {
    this.initEvent();
  }

  release(): void {
    this.releaseEvent();
    this._marks.clear();
  }

  // event
  protected initEvent() {
    const event = this.event;
    const { enable: hoverEnable, trigger: hoverTrigger, triggerOff: hoverTriggerOff } = this._hover;
    const { enable: selectEnable, trigger: selectTrigger, triggerOff: selectTriggerOff } = this._select;
    if (hoverEnable) {
      // 进行 hover 交互相关的事件绑定
      array(hoverTrigger).forEach(trigger => {
        event.on(trigger, { level: Event_Bubble_Level.chart }, this.onHover as EventCallback<EventParams>);
      });
      if (hoverTriggerOff && hoverTriggerOff !== 'none') {
        array(hoverTriggerOff).forEach(trigger => {
          event.on(
            trigger,
            { level: Event_Bubble_Level.vchart, source: Event_Source_Type.chart },
            this.onUnHover as EventCallback<EventParams>
          );
        });
      }
    }

    if (selectEnable) {
      // 进行 select 交互相关的事件绑定
      array(selectTrigger).forEach(trigger => {
        event.on(trigger, { level: Event_Bubble_Level.mark }, this.onSelect as EventCallback<EventParams>);
      });
      if (selectTriggerOff && selectTriggerOff !== 'none') {
        array(selectTriggerOff).forEach(trigger => {
          event.on(trigger, { level: Event_Bubble_Level.mark }, this.onUnSelect as EventCallback<EventParams>);
        });
      }
      // default triggerOff: active without mark , unselected
      if (!selectTriggerOff) {
        array(selectTriggerOff ?? selectTrigger).forEach(trigger => {
          event.on(trigger, { level: Event_Bubble_Level.vchart }, this.onUnSelect as EventCallback<EventParams>);
        });
      }
    }
  }

  protected releaseEvent(): void {
    this.event.release();
  }

  private initConfig(mode: RenderMode): void {
    const defaultConfig = getDefaultInteractionConfigByMode(mode);
    this._hover = { ...defaultConfig?.hover };
    this._select = { ...defaultConfig?.select };

    const hoverSpec = this._spec.hover;
    if (isBoolean(hoverSpec)) {
      this._hover.enable = hoverSpec;
    } else if (isObject(hoverSpec)) {
      this._hover.enable = true;
      this._hover = mergeSpec(this._hover, hoverSpec);
    }

    const selectSpec = this._spec.select;
    if (isBoolean(selectSpec)) {
      this._select.enable = selectSpec;
    } else if (isObject(selectSpec)) {
      this._select.enable = true;
      this._select = mergeSpec(this._select, selectSpec);
    }
  }

  private onHover = (params: BaseEventParams) => {
    /**
     * 多个series的时候，trigger会有多个，每个trigger管理自己的marks
     * 如果不加状态
     * 会存在A系列触发hover，B系列触发unhover清空A系列高亮元素的情况
     */
    if (this.filterEventMark(params)) {
      this._isHovered = true;
      this.hoverItem(params);
    } else if (this._isHovered) {
      this._isHovered = false;
      this.unhoverItem();
    }
  };

  private onUnHover = (params: BaseEventParams) => {
    if (this.filterEventMark(params) || this.interaction.filterEventMark(params, STATE_VALUE_ENUM.STATE_HOVER)) {
      return;
    }
    if (this.interaction.getEventElement(STATE_VALUE_ENUM.STATE_HOVER)[0]) {
      this.unhoverItem();
    }
  };

  private onSelect = (params: BaseEventParams) => {
    this.handleSingleEventSelect(params);
  };

  private onUnSelect = (params: BaseEventParams) => {
    if (!this.interaction.filterEventMark(params, STATE_VALUE_ENUM.STATE_SELECTED)) {
      this.clearSelectedItems();
    }
  };

  // hover
  protected hoverItem(params: BaseEventParams): void {
    const { datum } = params;
    const lastEl = this.interaction.getEventElement(STATE_VALUE_ENUM.STATE_HOVER)[0];
    if (params.item === lastEl) {
      return;
    }
    this.interaction.exchangeEventElement(STATE_VALUE_ENUM.STATE_HOVER, params.item);
    this.interaction.reverseEventElement(STATE_VALUE_ENUM.STATE_HOVER);
    this.event.emit('hovered', {
      model: this._option.model,
      value: [datum]
    });
  }

  protected unhoverItem(): void {
    const lastHoveredDatums = this.interaction.getEventElementData(STATE_VALUE_ENUM.STATE_HOVER);
    this.interaction.clearEventElement(STATE_VALUE_ENUM.STATE_HOVER, true);

    this.event.emit('unhovered', {
      model: this._option.model,
      value: lastHoveredDatums
    });
  }

  protected handleSingleEventHover(params: BaseEventParams): void {
    if (this.filterEventMark(params)) {
      this.hoverItem(params);
    } else if (
      this.interaction.getEventElement(STATE_VALUE_ENUM.STATE_HOVER)[0] &&
      !this.interaction.filterEventMark(params, STATE_VALUE_ENUM.STATE_HOVER)
    ) {
      this.unhoverItem();
    }
  }

  // select
  protected selectItems(datums: any[]): void {
    this.event.emit('selected', {
      model: this._option.model,
      value: datums
    });
  }

  protected clearSelectedItems() {
    const lastSelectedItem = this.interaction.getEventElementData(STATE_VALUE_ENUM.STATE_SELECTED);
    this.interaction.clearEventElement(STATE_VALUE_ENUM.STATE_SELECTED, true);

    this.event.emit('unselected', {
      model: this._option.model,
      value: lastSelectedItem
    });
  }

  protected unselectItems(params: BaseEventParams): void {
    const { triggerOff } = this._select;
    if (triggerOff !== 'none') {
      this.interaction.removeEventElement(STATE_VALUE_ENUM.STATE_SELECTED, params.item);
      this.event.emit('unselected', {
        model: this._option.model,
        value: params.item
      });
    }
  }

  protected handleSingleEventSelect(params: BaseEventParams): void {
    if (this.filterEventMark(params)) {
      if (params.item.getStates().includes(STATE_VALUE_ENUM.STATE_SELECTED)) {
        this.unselectItems(params);
      } else {
        switch (this._select.mode) {
          case 'multiple':
            this.interaction.addEventElement(STATE_VALUE_ENUM.STATE_SELECTED, params.item);
            break;
          case 'single':
          default:
            this.interaction.exchangeEventElement(STATE_VALUE_ENUM.STATE_SELECTED, params.item);
        }
        this.interaction.reverseEventElement(STATE_VALUE_ENUM.STATE_SELECTED);
        const items = this.interaction.getEventElementData(STATE_VALUE_ENUM.STATE_SELECTED);
        this.selectItems(items);
      }
    } else if (
      // 不做已选内容的判断，因为选中的元素可能由用户 API 控制
      // this._selectedItems.length > 0 &&
      !this.interaction.filterEventMark(params, STATE_VALUE_ENUM.STATE_SELECTED)
    ) {
      this.clearSelectedItems();
    }
  }

  // util
  protected filterEventMark(params: BaseEventParams): boolean {
    return !!(params.mark && this._marks.includes(params.mark));
  }

  protected isDatumEqual(datumA: any, datumB: any): boolean {
    const fields = this._fields ? this._fields : Object.keys(datumA);
    return fields.every(f => datumA[f] === datumB[f]);
  }
}
