import type { RenderMode } from '../typings/spec/common';
import type { EventType, EventQuery, EventCallback, EventParamsDefinition, IEvent, IEventDispatcher, IComposedEvent, EventParams, EventBubbleLevel } from './interface';
export declare class Event implements IEvent {
    private _eventDispatcher;
    private _mode;
    private _composedEventMap;
    getComposedEventMap(): Map<EventCallback<EventParams>, {
        eventType: string;
        event: IComposedEvent;
    }>;
    constructor(eventDispatcher: IEventDispatcher, mode: RenderMode);
    on<Evt extends EventType>(eType: Evt, callback: EventCallback<EventParamsDefinition[Evt]>): this;
    on<Evt extends EventType>(eType: Evt, query: EventQuery, callback: EventCallback<EventParamsDefinition[Evt]>): this;
    off<Evt extends EventType>(eType: Evt, callback?: EventCallback<EventParamsDefinition[Evt]>): this;
    off<Evt extends EventType>(eType: Evt, query: EventQuery, callback: EventCallback<EventParamsDefinition[Evt]>): this;
    emit<Evt extends EventType>(eType: Evt, params: EventParamsDefinition[Evt], level?: EventBubbleLevel): this;
    release(): void;
}
