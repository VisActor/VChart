import { isEmpty, array } from '@visactor/vutils';
import type { IElement } from '@visactor/vgrammar-core';
import type { IMark } from '../mark/interface';
import type { BaseEventParams, EventCallback, EventParams, IEvent } from '../event/interface';
import type { IHoverSpec, IInteraction, ISelectSpec, ITrigger, ITriggerOption } from './interface';
import type { RenderMode } from '../typings/spec';
import { MarkSet } from '../mark/mark-set';
import { STATE_VALUE_ENUM } from '../compile/mark/interface';
import type { ISeries } from '../series';

export class GroupTrigger implements ITrigger {
  // 事件
  readonly event: IEvent;

  protected readonly interaction: IInteraction;

  protected _option: ITriggerOption;
  protected _marks: MarkSet = new MarkSet();
  protected _markReverse: MarkSet = new MarkSet();

  protected _lastSeries: ISeries;
  protected _lastGroupValue: any;

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
    if (!isEmpty(mark.stateStyle[STATE_VALUE_ENUM.STATE_GROUP_HOVER])) {
      this._marks.addMark(mark);
    }
    if (!isEmpty(mark.stateStyle[STATE_VALUE_ENUM.STATE_GROUP_HOVER_REVERSE])) {
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
    event.on('pointermove', this.onHover as EventCallback<EventParams>);
  }

  protected releaseEvent(): void {
    this.event.release();
  }

  private initConfig(mode: RenderMode): void {
    // do nothing
  }

  protected getEventElement(groupValue: any, series: ISeries, reverse: boolean = false) {
    const items: IElement[] = [];
    const seriesField = series.getSeriesField();
    const seriesMark = (reverse ? this._markReverse : this._marks)
      .getMarks()
      .filter(m => m.model === series && m.getVisible());

    seriesMark.forEach(m => {
      const markProduct = m.getProduct();
      if (!markProduct || !markProduct.elements) {
        return;
      }

      const elements = markProduct.elements.filter(e => {
        const datum = array(e.getDatum());
        return datum.every(oneData => {
          const c = oneData[seriesField] === groupValue;
          return reverse ? !c : c;
        });
      });
      items.push(...elements);
    });

    return items;
  }

  protected _getGroupValue = (params: BaseEventParams) => {
    const { item, mark, model } = params;
    if (!item || !mark || !model || model.modelType !== 'series') {
      return {};
    }
    const series = model as ISeries;
    const seriesField = series.getSeriesField();
    if (!seriesField) {
      return {};
    }

    const itemDatum = array(item.getDatum());
    const groupValue = itemDatum[0][seriesField];
    // 判断 item 携带的数据项是否都属于同一组
    for (let i = 1; i < itemDatum.length; i++) {
      if (itemDatum[i][seriesField] !== groupValue) {
        return {};
      }
    }

    return {
      series,
      groupValue
    };
  };

  private onHover = (params: BaseEventParams) => {
    const { series, groupValue } = this._getGroupValue(params);

    if (this._lastGroupValue === groupValue && this._lastSeries === series) {
      return;
    }
    this._lastGroupValue = groupValue;
    this._lastSeries = series;

    // 判断鼠标是否移到空白区域
    if (!groupValue) {
      // clear all
      this.interaction.clearEventElement(STATE_VALUE_ENUM.STATE_GROUP_HOVER, true);
      return;
    }

    // clear last hover
    const lastHover = this.interaction.getEventElement(STATE_VALUE_ENUM.STATE_GROUP_HOVER);
    lastHover.forEach(e => this.interaction.addEventElement(STATE_VALUE_ENUM.STATE_GROUP_HOVER_REVERSE, e));
    this.interaction.clearEventElement(STATE_VALUE_ENUM.STATE_GROUP_HOVER, false);
    // add new
    const elements = this.getEventElement(groupValue, series);
    elements.forEach(el => this.interaction.addEventElement(STATE_VALUE_ENUM.STATE_GROUP_HOVER, el));
    this.interaction.reverseEventElement(STATE_VALUE_ENUM.STATE_GROUP_HOVER);
  };
}
