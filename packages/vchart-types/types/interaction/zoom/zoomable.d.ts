import type { BaseEventParams, ExtendEventParam, IEvent } from '../../event/interface';
import type { IRegion } from '../../region/interface';
import type { RenderMode } from '../../typings/spec';
import type { ISeries } from '../../series/interface';
import type { IDelayType } from '../../typings/event';
export interface ITriggerOption {
    delayType: IDelayType;
    delayTime: number;
    realTime: boolean;
}
export interface IZoomEventOptions {
    shouldZoom?: boolean;
    zoomCallback?: (params: {
        zoomDelta: number;
        zoomX: number;
        zoomY: number;
    }, e: BaseEventParams['event']) => void;
    shouldScroll?: boolean;
    scrollCallback?: (params: {
        scrollX: number;
        scrollY: number;
    }, e: BaseEventParams['event']) => void;
}
export interface IZoomable {
    initZoomable: (evt: IEvent, mode?: RenderMode) => void;
    initZoomEventOfSeries: (s: ISeries, callback?: (params: {
        zoomDelta: number;
        zoomX: number;
        zoomY: number;
    }, e: BaseEventParams['event']) => void) => any;
    initZoomEventOfRegions: (regions: IRegion[], filter?: (s: ISeries) => boolean, callback?: (params: {
        zoomDelta: number;
        zoomX: number;
        zoomY: number;
    }, e: BaseEventParams['event']) => void, option?: ITriggerOption) => void;
    initScrollEventOfSeries: (s: ISeries, callback?: (params: {
        scrollX: number;
        scrollY: number;
    }, e: BaseEventParams['event']) => void) => any;
    initScrollEventOfRegions: (regions: IRegion[], filter?: (s: ISeries) => boolean, callback?: (params: {
        scrollX: number;
        scrollY: number;
    }, e: BaseEventParams['event']) => void, option?: ITriggerOption) => void;
    initDragEventOfSeries: (s: ISeries, callback?: (delta: [number, number], e: BaseEventParams['event']) => void, option?: ITriggerOption) => any;
    initDragEventOfRegions: (regions: IRegion[], filter?: (s: ISeries) => boolean, callback?: (delta: [number, number], e: BaseEventParams['event']) => void, option?: ITriggerOption) => void;
}
export declare class Zoomable implements IZoomable {
    private _clickEnable;
    private _option;
    private _zoomableTrigger;
    private _eventObj;
    private _renderMode;
    private _gestureController;
    private _isGestureListener;
    initZoomable(evt: IEvent, mode?: RenderMode): void;
    private _getTriggerEvent;
    private _zoomEventDispatch;
    private _getRegionOrSeriesLayout;
    private _bindZoomEventAsRegion;
    initZoomEventOfSeries(s: ISeries, callback?: (params: {
        zoomDelta: number;
        zoomX: number;
        zoomY: number;
    }, e: BaseEventParams['event']) => void, option?: ITriggerOption): void;
    initZoomEventOfRegions(regions: IRegion[], filter?: (s: ISeries) => boolean, callback?: (params: {
        zoomDelta: number;
        zoomX: number;
        zoomY: number;
    }, e: BaseEventParams['event']) => void, option?: ITriggerOption): void;
    private _scrollEventDispatch;
    private _bindScrollEventAsRegion;
    initScrollEventOfSeries(s: ISeries, callback?: (params: {
        scrollX: number;
        scrollY: number;
    }, e: BaseEventParams['event']) => void, option?: ITriggerOption): void;
    initScrollEventOfRegions(regions: IRegion[], filter?: (s: ISeries) => boolean, callback?: (params: {
        scrollX: number;
        scrollY: number;
    }, e: BaseEventParams['event']) => void, option?: ITriggerOption): void;
    private _bindDragEventAsRegion;
    initDragEventOfSeries(s: ISeries, callback?: (delta: [number, number], e: BaseEventParams['event']) => void, option?: ITriggerOption): void;
    initDragEventOfRegions(regions: IRegion[], filter?: (s: ISeries) => boolean, callback?: (delta: [number, number], e: BaseEventParams['event']) => void, option?: ITriggerOption): void;
    protected _handleDrag(params: ExtendEventParam, callback?: (delta: [number, number], e: BaseEventParams['event']) => void, option?: ITriggerOption): void;
}
