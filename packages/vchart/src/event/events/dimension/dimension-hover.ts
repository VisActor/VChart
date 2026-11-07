import { isMobileLikeMode } from '../../../util/env';
import type { BaseEventParams, EventHandler, EventParamsDefinition, EventType } from '../../interface';
import { DimensionEvent } from './base';
import { isSameDimensionInfo } from './util/common';
import { Event_Source_Type } from '../../../constant/event';
import type { IDimensionInfo } from './interface';

export class DimensionHoverEvent extends DimensionEvent {
  private _cacheDimensionInfo: IDimensionInfo[] | null = null;
  private _eventHandlers: Map<
    'pointermove' | 'pointerout' | 'pointercancel' | 'pointerdown',
    EventHandler<BaseEventParams>
  > = new Map();

  register<Evt extends EventType>(eType: Evt, handler: EventHandler<EventParamsDefinition[Evt]>) {
    this._callback = handler.callback;

    this._eventHandlers.set('pointermove', {
      query: { ...handler.query, source: Event_Source_Type.chart },
      callback: this.onMouseMove
    });

    this._eventHandlers.set('pointerout', {
      query: { ...handler.query, source: Event_Source_Type.canvas },
      callback: this.onMouseOut
    });

    this._eventHandlers.set('pointercancel', {
      query: { ...handler.query, source: Event_Source_Type.canvas },
      callback: this.onMouseOut
    });

    if (isMobileLikeMode(this._mode)) {
      // 移动端点按也触发 hover
      this._eventHandlers.set('pointerdown', {
        query: { ...handler.query, source: Event_Source_Type.chart },
        callback: this.onMouseMove
      });
    }
    this._eventHandlers.forEach((eventHandler, type) => this._eventDispatcher.register(type, eventHandler));
  }

  unregister() {
    this._eventHandlers.forEach((eventHandler, type) => this._eventDispatcher.unregister(type, eventHandler));
    this._eventHandlers.clear();
  }

  protected onDispatch(dimensionInfo: IDimensionInfo[]) {
    this._cacheDimensionInfo = dimensionInfo.length ? dimensionInfo.slice() : null;
    super.onDispatch(dimensionInfo);
  }

  private onMouseMove = (params: BaseEventParams) => {
    if (!params || params.chart?.getOption()?.globalInstance?.disableDimensionHoverEvent?.()) {
      return;
    }
    const x = (params.event as any).viewX;
    const y = (params.event as any).viewY;
    const targetDimensionInfo = this.getTargetDimensionInfo(x, y);
    if (targetDimensionInfo === null && this._cacheDimensionInfo !== null) {
      this.onMouseOut(params);
    } else if (
      targetDimensionInfo !== null &&
      (this._cacheDimensionInfo === null ||
        targetDimensionInfo.length !== this._cacheDimensionInfo.length ||
        targetDimensionInfo.some((info, i) => !isSameDimensionInfo(info, this._cacheDimensionInfo![i])))
    ) {
      // Commit before callbacks: cancellation must not be overwritten on return.
      this._cacheDimensionInfo = targetDimensionInfo;
      this._callback.call(null, {
        ...params,
        action: 'enter',
        dimensionInfo: targetDimensionInfo.slice()
      });
    } else if (targetDimensionInfo !== null) {
      // 鼠标在某维度上滑动
      this._callback.call(null, {
        ...params,
        action: 'move',
        dimensionInfo: targetDimensionInfo.slice()
      });
    }
  };

  private onMouseOut = (params: BaseEventParams) => {
    if (!params || params.chart?.getOption()?.globalInstance?.disableDimensionHoverEvent?.()) {
      return;
    }
    const previous = this._cacheDimensionInfo;
    if (previous === null) {
      return;
    }
    this._cacheDimensionInfo = null;
    this._callback.call(null, { ...params, action: 'leave', dimensionInfo: previous.slice() });
  };
}
