import { Event_Source_Type } from '../../../constant/event';
import type { BaseEventParams, EventHandler, EventParamsDefinition, EventType } from '../../interface';
import { DimensionEvent } from './base';

export class DimensionClickEvent extends DimensionEvent {
  private _eventHandler?: EventHandler<BaseEventParams>;

  register<Evt extends EventType>(eType: Evt, handler: EventHandler<EventParamsDefinition[Evt]>) {
    this._callback = handler.callback;

    this._eventHandler = {
      query: { ...handler.query, source: Event_Source_Type.chart },
      callback: this.onClick
    };
    this._eventDispatcher.register('pointertap', this._eventHandler);
  }

  unregister() {
    if (this._eventHandler) {
      this._eventDispatcher.unregister('pointertap', this._eventHandler);
      this._eventHandler = undefined;
    }
  }

  private onClick = (params: BaseEventParams) => {
    if (!params) {
      return;
    }
    const x = (params.event as any).viewX;
    const y = (params.event as any).viewY;
    const targetDimensionInfo = this.getTargetDimensionInfo(x, y);
    if (!targetDimensionInfo) {
      return;
    }
    this._callback.call(null, {
      ...params,
      action: 'click',
      dimensionInfo: targetDimensionInfo.slice()
    });
  };
}
