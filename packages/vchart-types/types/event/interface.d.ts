import type { IGraphic } from '@visactor/vrender-core';
import type { IElement } from '@visactor/vgrammar-core';
import type { IChart } from '../chart/interface';
import type { IModel } from '../model/interface';
import type { IMark, MarkType } from '../mark/interface';
import type { VChart } from '../core/vchart';
import type { DimensionEventParams } from './events/dimension/interface';
import type { Datum, IPoint, StringOrNumber } from '../typings';
import type { ChartEvent, Event_Bubble_Level, Event_Source_Type, VGRAMMAR_HOOK_EVENT } from '../constant';
import type { SeriesType } from '../series/interface';
import type { TooltipEventParams } from '../component/tooltip/interface/event';
import type { ILayoutItem } from '../layout/interface';
export type EventType = 'pointerdown' | 'pointerup' | 'pointerupoutside' | 'pointertap' | 'pointerover' | 'pointermove' | 'pointerenter' | 'pointerleave' | 'pointerout' | 'mousedown' | 'mouseup' | 'mouseupoutside' | 'rightdown' | 'rightup' | 'rightupoutside' | 'click' | 'dblclick' | 'mousemove' | 'mouseover' | 'mouseout' | 'mouseenter' | 'mouseleave' | 'wheel' | 'touchstart' | 'touchend' | 'touchendoutside' | 'touchmove' | 'touchcancel' | 'tap' | 'dragstart' | 'drag' | 'dragenter' | 'dragleave' | 'dragover' | 'dragend' | 'drop' | 'pan' | 'panstart' | 'panend' | 'press' | 'pressup' | 'pressend' | 'pinch' | 'pinchstart' | 'pinchend' | 'swipe' | keyof typeof ChartEvent | keyof typeof VGRAMMAR_HOOK_EVENT | string;
export type EventBubbleLevel = keyof typeof Event_Bubble_Level;
export type ComponentType = 'axis' | 'dataZoom' | 'indicator' | 'legend' | 'mapLabel' | 'markLine' | 'markArea' | 'markPoint' | 'tooltip' | 'title' | 'label' | 'totalLabel' | 'customMark';
export type EventTargetType = MarkType | ComponentType | SeriesType;
export type EventSourceType = keyof typeof Event_Source_Type;
export type EventQuery = {
    level?: EventBubbleLevel;
    source?: EventSourceType;
    nodeName?: string;
    markName?: string;
    type?: EventTargetType;
    id?: StringOrNumber;
    filter?: (params: Partial<BaseEventParams>) => boolean;
    throttle?: number;
    debounce?: number;
    consume?: boolean;
};
export type EventParams = {
    event?: SuperEvent;
    value?: any;
    mark?: IMark;
    model?: IModel;
    chart?: IChart;
    datum?: Datum;
    node?: IGraphic;
};
type SuperEvent = Event & {
    [key: string]: any;
};
export type BaseEventParams = EventParams & {
    event: SuperEvent;
    item: IElement;
    datum: Datum;
    source: EventSourceType;
    itemMap: Map<string, any>;
};
export type EventCallback<Params extends EventParams> = (params: Params) => boolean | void;
export type EventFilter = {
    source: EventSourceType;
    level: EventBubbleLevel;
    type: string | null;
    markName: string | null;
    nodeName: string | null;
    userId: StringOrNumber | null;
    filter: (params: Partial<BaseEventParams>) => boolean | null;
};
export type EventHandler<Params extends EventParams> = {
    callback: EventCallback<Params>;
    query: EventQuery | null;
    wrappedCallback?: EventCallback<Params>;
    filter?: EventFilter;
};
export type ExtendEventParam = EventParams & {
    event?: Event;
    item?: any;
    datum?: Datum;
    source?: EventSourceType;
    itemMap?: Map<string, any>;
};
export type LayoutEventParam = {
    elements: (ILayoutItem & {
        type: string;
    })[];
} & Partial<BaseEventParams>;
export type PanEventParam = ExtendEventParam & {
    delta: [number, number];
};
export type ZoomEventParam = ExtendEventParam & {
    scale: number;
    scaleCenter: IPoint;
};
export type EventParamsDefinition = {
    pointerdown: BaseEventParams;
    pointerup: BaseEventParams;
    pointerupoutside: BaseEventParams;
    pointertap: BaseEventParams;
    pointerover: BaseEventParams;
    pointermove: BaseEventParams;
    pointerenter: BaseEventParams;
    pointerleave: BaseEventParams;
    pointerout: BaseEventParams;
    mousedown: BaseEventParams;
    mouseup: BaseEventParams;
    mouseupoutside: BaseEventParams;
    rightdown: BaseEventParams;
    rightup: BaseEventParams;
    rightupoutside: BaseEventParams;
    click: BaseEventParams;
    dblclick: BaseEventParams;
    mousemove: BaseEventParams;
    mouseover: BaseEventParams;
    mouseout: BaseEventParams;
    mouseenter: BaseEventParams;
    mouseleave: BaseEventParams;
    wheel: BaseEventParams;
    touchstart: BaseEventParams;
    touchend: BaseEventParams;
    touchendoutside: BaseEventParams;
    touchmove: BaseEventParams;
    touchcancel: BaseEventParams;
    dragstart: BaseEventParams;
    drag: BaseEventParams;
    dragenter: BaseEventParams;
    dragleave: BaseEventParams;
    dragover: BaseEventParams;
    dragend: BaseEventParams;
    drop: BaseEventParams;
    tap: BaseEventParams;
    pan: BaseEventParams;
    panstart: BaseEventParams;
    panend: BaseEventParams;
    press: BaseEventParams;
    pressup: BaseEventParams;
    pressend: BaseEventParams;
    pinch: BaseEventParams;
    pinchstart: BaseEventParams;
    pinchend: BaseEventParams;
    swipe: BaseEventParams;
    dimensionHover: DimensionEventParams;
    dimensionClick: DimensionEventParams;
    tooltipShow: TooltipEventParams;
    tooltipHide: TooltipEventParams;
    tooltipRelease: TooltipEventParams;
    afterLayout: LayoutEventParam;
    [key: string]: ExtendEventParam;
};
export interface IEventDispatcher {
    globalInstance: VChart;
    register: <Evt extends EventType>(eType: Evt, handler: EventHandler<EventParamsDefinition[Evt]>) => this;
    unregister: <Evt extends EventType>(eType: Evt, handler?: EventHandler<EventParamsDefinition[Evt]>) => this;
    dispatch: <Evt extends EventType>(eType: Evt, params?: EventParamsDefinition[Evt], level?: EventBubbleLevel) => this;
    release: () => void;
}
export interface IEvent {
    on: (<Evt extends EventType>(eType: Evt, callback: EventCallback<EventParamsDefinition[Evt]>) => this) & (<Evt extends EventType>(eType: Evt, query: EventQuery, callback: EventCallback<EventParamsDefinition[Evt]>) => this);
    off: (<Evt extends EventType>(eType: Evt, callback?: EventCallback<EventParamsDefinition[Evt]>) => this) & (<Evt extends EventType>(eType: Evt, query: EventQuery, callback: EventCallback<EventParamsDefinition[Evt]>) => this);
    emit: <Evt extends EventType>(eType: Evt, params: EventParamsDefinition[Evt], level?: EventBubbleLevel) => void;
    release: () => void;
    getComposedEventMap: () => Map<EventCallback<EventParams>, {
        eventType: EventType;
        event: IComposedEvent;
    }>;
}
export interface IComposedEvent {
    register: <Evt extends EventType>(eType: Evt, handler: EventHandler<EventParamsDefinition[Evt]>) => void;
    unregister: () => void;
    dispatch: (v: unknown, opt: unknown) => unknown;
}
export {};
