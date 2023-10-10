import type { BaseEventParams, ExtendEventParam, IEvent } from '../../event/interface';
import type { IRegion } from '../../region/interface';
import type { RenderMode } from '../../typings/spec';
import type { ISeries } from '../../series/interface';
export interface IZoomEventOptions {
  shouldZoom?: boolean;
  zoomCallback?: (
    params: {
      zoomDelta: number;
      zoomX: number;
      zoomY: number;
    },
    e: BaseEventParams['event']
  ) => void;
  shouldScroll?: boolean;
  scrollCallback?: (
    params: {
      scrollX: number;
      scrollY: number;
    },
    e: BaseEventParams['event']
  ) => void;
}
export interface IZoomable {
  initZoomable: (evt: IEvent, mode?: RenderMode) => void;
  initZoomEventOfSeries: (
    s: ISeries,
    callback?: (
      params: {
        zoomDelta: number;
        zoomX: number;
        zoomY: number;
      },
      e: BaseEventParams['event']
    ) => void
  ) => any;
  initZoomEventOfRegions: (
    regions: IRegion[],
    filter?: (s: ISeries) => boolean,
    callback?: (
      params: {
        zoomDelta: number;
        zoomX: number;
        zoomY: number;
      },
      e: BaseEventParams['event']
    ) => void
  ) => void;
  initScrollEventOfSeries: (
    s: ISeries,
    callback?: (
      params: {
        scrollX: number;
        scrollY: number;
      },
      e: BaseEventParams['event']
    ) => void
  ) => any;
  initScrollEventOfRegions: (
    regions: IRegion[],
    filter?: (s: ISeries) => boolean,
    callback?: (
      params: {
        scrollX: number;
        scrollY: number;
      },
      e: BaseEventParams['event']
    ) => void
  ) => void;
  initDragEventOfSeries: (s: ISeries, callback?: (delta: [number, number], e: BaseEventParams['event']) => void) => any;
  initDragEventOfRegions: (
    regions: IRegion[],
    filter?: (s: ISeries) => boolean,
    callback?: (delta: [number, number], e: BaseEventParams['event']) => void
  ) => void;
}
export declare class Zoomable implements IZoomable {
  private _clickEnable;
  private _zoomableTrigger;
  private _eventObj;
  private _renderMode;
  initZoomable(evt: IEvent, mode?: RenderMode): void;
  private _getTriggerEvent;
  private _bindZoomEventAsRegion;
  initZoomEventOfSeries(
    s: ISeries,
    callback?: (
      params: {
        zoomDelta: number;
        zoomX: number;
        zoomY: number;
      },
      e: BaseEventParams['event']
    ) => void
  ): void;
  initZoomEventOfRegions(
    regions: IRegion[],
    filter?: (s: ISeries) => boolean,
    callback?: (
      params: {
        zoomDelta: number;
        zoomX: number;
        zoomY: number;
      },
      e: BaseEventParams['event']
    ) => void
  ): void;
  initScrollEventOfSeries(
    s: ISeries,
    callback?: (
      params: {
        scrollX: number;
        scrollY: number;
      },
      e: BaseEventParams['event']
    ) => void
  ): void;
  initScrollEventOfRegions(
    regions: IRegion[],
    filter?: (s: ISeries) => boolean,
    callback?: (
      params: {
        scrollX: number;
        scrollY: number;
      },
      e: BaseEventParams['event']
    ) => void
  ): void;
  private _bindScrollEventAsRegion;
  private _bindDragEventAsRegion;
  initDragEventOfSeries(s: ISeries, callback?: (delta: [number, number], e: BaseEventParams['event']) => void): void;
  initDragEventOfRegions(
    regions: IRegion[],
    filter?: (s: ISeries) => boolean,
    callback?: (delta: [number, number], e: BaseEventParams['event']) => void
  ): void;
  protected _handleDrag(
    params: ExtendEventParam,
    callback?: (delta: [number, number], e: BaseEventParams['event']) => void
  ): void;
}
