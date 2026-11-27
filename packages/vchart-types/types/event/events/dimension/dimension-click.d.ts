import type { EventHandler, EventParamsDefinition, EventType } from '../../interface';
import { DimensionEvent } from './base';
export declare class DimensionClickEvent extends DimensionEvent {
    private _eventHandler?;
    register<Evt extends EventType>(eType: Evt, handler: EventHandler<EventParamsDefinition[Evt]>): void;
    unregister(): void;
    private onClick;
}
