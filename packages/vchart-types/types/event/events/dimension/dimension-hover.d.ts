import type { EventHandler, EventParamsDefinition, EventType } from '../../interface';
import { DimensionEvent } from './base';
import type { IDimensionInfo } from './interface';
export declare class DimensionHoverEvent extends DimensionEvent {
    private _cacheDimensionInfo;
    private _eventHandlers;
    register<Evt extends EventType>(eType: Evt, handler: EventHandler<EventParamsDefinition[Evt]>): void;
    unregister(): void;
    protected onDispatch(dimensionInfo: IDimensionInfo[]): void;
    private onMouseMove;
    private onMouseOut;
}
