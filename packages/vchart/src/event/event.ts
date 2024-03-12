/*eslint no-dupe-class-members: "off"*/

import type { RenderMode } from '../typings/spec/common';
import { ComposedEventMapper } from './events';
import type {
  EventType,
  EventQuery,
  EventCallback,
  EventParamsDefinition,
  IEvent,
  IEventDispatcher,
  IComposedEvent,
  EventParams,
  EventHandler,
  EventBubbleLevel
} from './interface';

export class Event implements IEvent {
  private _eventDispatcher: IEventDispatcher;
  private _mode: RenderMode;

  private _composedEventMap: Map<EventCallback<EventParams>, { eventType: EventType; event: IComposedEvent }> =
    new Map();
  getComposedEventMap() {
    return this._composedEventMap;
  }

  constructor(eventDispatcher: IEventDispatcher, mode: RenderMode) {
    this._eventDispatcher = eventDispatcher;
    this._mode = mode;
  }

  on<Evt extends EventType>(eType: Evt, callback: EventCallback<EventParamsDefinition[Evt]>): this;
  on<Evt extends EventType>(eType: Evt, query: EventQuery, callback: EventCallback<EventParamsDefinition[Evt]>): this;
  on<Evt extends EventType>(
    eType: Evt,
    query: EventQuery | EventCallback<EventParamsDefinition[Evt]>,
    callback?: EventCallback<EventParamsDefinition[Evt]>
  ): this {
    const handler =
      typeof query === 'function'
        ? { query: null, callback: query }
        : {
            query,
            callback: callback as EventCallback<EventParamsDefinition[Evt]>
          };

    if (ComposedEventMapper[eType as string]) {
      const composedEvent = new ComposedEventMapper[eType as string](
        this._eventDispatcher,
        this._mode
      ) as IComposedEvent;
      composedEvent.register(eType, handler);
      this._composedEventMap.set(callback as EventCallback<EventParamsDefinition[Evt]>, {
        eventType: eType,
        event: composedEvent
      });
    } else {
      this._eventDispatcher.register(eType, handler);
    }

    return this;
  }

  off<Evt extends EventType>(eType: Evt, callback?: EventCallback<EventParamsDefinition[Evt]>): this;
  off<Evt extends EventType>(eType: Evt, query: EventQuery, callback: EventCallback<EventParamsDefinition[Evt]>): this;
  off<Evt extends EventType>(
    eType: Evt,
    query?: EventQuery | EventCallback<EventParamsDefinition[Evt]>,
    cb?: EventCallback<EventParamsDefinition[Evt]>
  ): this {
    const callback = (cb ?? query) as EventCallback<EventParamsDefinition[Evt]>;
    if (ComposedEventMapper[eType as string]) {
      if (callback) {
        this._composedEventMap.get(callback)?.event.unregister();
        this._composedEventMap.delete(callback);
      } else {
        for (const entry of this._composedEventMap.entries()) {
          if (entry[1].eventType === eType) {
            this._composedEventMap.get(entry[0])?.event.unregister();
            this._composedEventMap.delete(entry[0]);
          }
        }
      }
    } else {
      if (callback) {
        const handler: EventHandler<EventParamsDefinition[Evt]> = {
          callback,
          query: null,
          // 卸载事件时无需处理 source 以外的参数
          filter: {
            nodeName: null,
            type: eType,
            level: null,
            source: (query as EventQuery).source,
            markName: null,
            filter: null,
            userId: null
          }
        };
        this._eventDispatcher.unregister(eType, handler);
      } else {
        this._eventDispatcher.unregister(eType);
      }
    }
    return this;
  }

  emit<Evt extends EventType>(eType: Evt, params: EventParamsDefinition[Evt], level?: EventBubbleLevel): this {
    this._eventDispatcher.dispatch(eType, params, level);
    return this;
  }

  release(): void {
    this._eventDispatcher.clear();
    this._composedEventMap.clear();
  }
}
