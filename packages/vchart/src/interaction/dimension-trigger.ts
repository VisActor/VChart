import { isEmpty, isArray } from '@visactor/vutils';
import type { IElement } from '@visactor/vgrammar-core';
import type { DimensionEventParams } from '../event/events/dimension/interface';
// eslint-disable-next-line no-duplicate-imports
import { DimensionEventEnum } from '../event/events/dimension/interface';

import type { IMark } from '../mark/interface';
import type { EventCallback, EventParams, IEvent } from '../event/interface';
import type { IHoverSpec, IInteraction, ISelectSpec, ITrigger, ITriggerOption } from './interface';
import type { RenderMode } from '../typings/spec';
import { MarkSet } from '../mark/mark-set';
import { STATE_VALUE_ENUM } from '../compile/mark/interface';

export class DimensionTrigger implements ITrigger {
  // 事件
  readonly event: IEvent;

  protected readonly interaction: IInteraction;

  protected _option: ITriggerOption;
  protected _marks: MarkSet = new MarkSet();
  protected _markReverse: MarkSet = new MarkSet();

  protected _lastDimensionEvent: DimensionEventParams = null;

  private _hover: IHoverSpec;
  get hover() {
    return this._hover;
  }
  private _select: ISelectSpec;
  get select() {
    return this._select;
  }

  constructor(option: ITriggerOption) {
    this._option = option;
    this.event = this._option.model.getOption().getChart().getEvent(); //  new Event(option.eventDispatcher, option.mode);
    this.interaction = option.interaction;
    this.initConfig(option.mode);
  }

  setStateKeys(fields: string[]): void {
    // do nothing
  }

  registerMark(mark: IMark): void {
    // do nothing
    if (!isEmpty(mark.stateStyle[STATE_VALUE_ENUM.STATE_DIMENSION_HOVER])) {
      this._marks.addMark(mark);
    }
    if (!isEmpty(mark.stateStyle[STATE_VALUE_ENUM.STATE_DIMENSION_HOVER_REVERSE])) {
      this._markReverse.addMark(mark);
    }
  }

  init(): void {
    this.initEvent();
  }

  release(): void {
    this.releaseEvent();
  }

  // event
  protected initEvent() {
    const event = this.event;
    event.on(DimensionEventEnum.dimensionHover, this.onHover as EventCallback<EventParams>);
  }

  protected releaseEvent(): void {
    this.event.release();
  }

  private initConfig(mode: RenderMode): void {
    // do nothing
  }

  protected getEventElement(params: DimensionEventParams, reverse: boolean = false): { el: IElement; mark: IMark }[] {
    // items 修改遍历方法从 mark

    const items: { el: IElement; mark: IMark }[] = [] as unknown as { el: IElement; mark: IMark }[];
    params.dimensionInfo.forEach(df => {
      df.data.forEach(dd => {
        const seriesMark = (reverse ? this._markReverse : this._marks)
          .getMarks()
          .filter(m => m.model === dd.series && m.getVisible());

        seriesMark.forEach(m => {
          const markProduct = m.getProduct();
          if (!markProduct || !markProduct.elements) {
            return;
          }

          const elements = markProduct.elements
            .filter(e => {
              const datum = e.getDatum();
              let c;
              if (isArray(datum)) {
                c = datum.every((oneData, i) => oneData === dd.datum[i]);
              } else {
                c = dd.datum.some(dd_d => dd_d === datum);
              }
              return reverse ? !c : c;
            })
            .map(el => {
              return {
                el,
                mark: m
              };
            });
          items.push(...elements);
        });
      });
    });

    return items;
  }

  protected dimensionDataEqual(params: DimensionEventParams) {
    if (this._lastDimensionEvent === params) {
      return true;
    }
    if (!this._lastDimensionEvent || !params) {
      return false;
    }
    if (this._lastDimensionEvent.dimensionInfo.length !== params.dimensionInfo.length) {
      return false;
    }
    for (let i = 0; i < this._lastDimensionEvent.dimensionInfo.length; i++) {
      const last = this._lastDimensionEvent.dimensionInfo[i];
      const current = params.dimensionInfo[i];
      if (last.value !== current.value) {
        return false;
      }
      if (last.axis !== current.axis) {
        return false;
      }
      if (last.data.length !== current.data.length) {
        return false;
      }
      for (let j = 0; j < last.data.length; j++) {
        const lastData = last.data[j];
        const currentData = current.data[j];
        if (lastData.series !== currentData.series) {
          return false;
        }
        if (lastData.datum.length !== currentData.datum.length) {
          return false;
        }
        for (let k = 0; k < lastData.datum.length; k++) {
          if (lastData.datum[k] !== currentData.datum[k]) {
            return false;
          }
        }
      }
    }
    return true;
  }

  private onHover = (params: DimensionEventParams) => {
    const elements = this.getEventElement(params);
    switch (params.action) {
      case 'enter':
        // clear last hover
        // eslint-disable-next-line no-case-declarations
        const lastHover = this.interaction.getEventElement(STATE_VALUE_ENUM.STATE_DIMENSION_HOVER);
        lastHover.forEach(e => {
          this.interaction.addEventElement(STATE_VALUE_ENUM.STATE_DIMENSION_HOVER_REVERSE, e);
        });
        this.interaction.clearEventElement(STATE_VALUE_ENUM.STATE_DIMENSION_HOVER, false);
        // add new
        elements.forEach(({ el, mark }) => {
          this.interaction.addEventElement(STATE_VALUE_ENUM.STATE_DIMENSION_HOVER, el);
        });
        this.interaction.reverseEventElement(STATE_VALUE_ENUM.STATE_DIMENSION_HOVER);
        break;
      case 'leave':
        // clear all
        this.interaction.clearEventElement(STATE_VALUE_ENUM.STATE_DIMENSION_HOVER, true);
        params = null;
        break;
      case 'click':
      case 'move':
      default:
        break;
    }
    this._lastDimensionEvent = params;
  };
}
