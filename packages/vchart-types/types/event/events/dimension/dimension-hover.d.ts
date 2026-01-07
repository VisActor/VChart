import type { EventHandler, EventParamsDefinition, EventType } from '../../interface';
import { DimensionEvent } from './base';
export declare class DimensionHoverEvent extends DimensionEvent {
    static _disableDimensionEvent: boolean;
    static disableDimensionEvent(value: boolean): void;
    private _cacheDimensionInfo;
    register<Evt extends EventType>(eType: Evt, handler: EventHandler<EventParamsDefinition[Evt]>): void;
    unregister(): void;
    private onMouseMove;
    private onMouseOut;
}
