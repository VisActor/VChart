import type { IModelOption } from './../../model/interface';
/* eslint-disable no-duplicate-imports */
import { debounce, isNil, pointInRect, throttle } from '@visactor/vutils';
import type { BaseEventParams, EventQuery, EventType, ExtendEventParam, IEvent } from '../../event/interface';
import type { IRegion } from '../../region/interface';
import type { RenderMode } from '../../typings/spec';
import { RenderModeEnum } from '../../typings/spec/common';
import { getDefaultTriggerEventByMode } from '../../component/common/trigger/config';
import type { IZoomTrigger } from '../../component/common/trigger/interface';
import type { ISeries } from '../../series/interface';
import { Event_Bubble_Level, Event_Source_Type } from '../../constant';
import type { IDelayType } from '../../typings/event';
import { isMiniAppLikeMode, isMobileLikeMode } from '../../util';
import type { Gesture } from '@visactor/vrender-kits';

const delayMap = {
  debounce: debounce,
  throttle: throttle
};

export interface ITriggerOption {
  delayType: IDelayType;
  delayTime: number;
  realTime: boolean;
}
export interface IZoomEventOptions {
  shouldZoom?: boolean;
  zoomCallback?: (params: { zoomDelta: number; zoomX: number; zoomY: number }, e: BaseEventParams['event']) => void;
  shouldScroll?: boolean;
  scrollCallback?: (params: { scrollX: number; scrollY: number }, e: BaseEventParams['event']) => void;
}
export interface IZoomable {
  initZoomable: (evt: IEvent, mode?: RenderMode) => void;
  initZoomEventOfSeries: (
    s: ISeries,
    callback?: (params: { zoomDelta: number; zoomX: number; zoomY: number }, e: BaseEventParams['event']) => void
  ) => any;
  initZoomEventOfRegions: (
    regions: IRegion[],
    filter?: (s: ISeries) => boolean,
    callback?: (params: { zoomDelta: number; zoomX: number; zoomY: number }, e: BaseEventParams['event']) => void,
    option?: ITriggerOption
  ) => void;

  initScrollEventOfSeries: (
    s: ISeries,
    callback?: (params: { scrollX: number; scrollY: number }, e: BaseEventParams['event']) => void
  ) => any;
  initScrollEventOfRegions: (
    regions: IRegion[],
    filter?: (s: ISeries) => boolean,
    callback?: (params: { scrollX: number; scrollY: number }, e: BaseEventParams['event']) => void,
    option?: ITriggerOption
  ) => void;

  initDragEventOfSeries: (
    s: ISeries,
    callback?: (delta: [number, number], e: BaseEventParams['event']) => void,
    option?: ITriggerOption
  ) => any;

  initDragEventOfRegions: (
    regions: IRegion[],
    filter?: (s: ISeries) => boolean,
    callback?: (delta: [number, number], e: BaseEventParams['event']) => void,
    option?: ITriggerOption
  ) => void;
}

export class Zoomable implements IZoomable {
  private _clickEnable: boolean;

  private _option: IModelOption;

  private _zoomableTrigger: IZoomTrigger;

  private _eventObj: IEvent;

  private _renderMode: RenderMode;

  private _gestureController!: Gesture | null;

  private _isGestureListener: boolean = false;

  initZoomable(evt: IEvent, mode: RenderMode = RenderModeEnum['desktop-browser']) {
    this._eventObj = evt;
    this._renderMode = mode;
    this._gestureController = (this._option.getChart().getVGrammarView().renderer as any)._gestureController;
    this._isGestureListener = isMobileLikeMode(this._renderMode) || isMiniAppLikeMode(this._renderMode);
    if (getDefaultTriggerEventByMode(this._renderMode)) {
      // hack 应该由事件系统做？或者事件系统有更好的方式处理这种交互冲突场景
      this._clickEnable = true;
      this._zoomableTrigger = new (this._getTriggerEvent('trigger') as any)();
    }
  }

  // event
  private _getTriggerEvent(type: string): EventType {
    return getDefaultTriggerEventByMode(this._renderMode)[type];
  }

  private _zoomEventDispatch(
    params: BaseEventParams,
    regionOrSeries: IRegion | ISeries,
    callback?: (params: { zoomDelta: number; zoomX: number; zoomY: number }, e: BaseEventParams['event']) => void
  ) {
    if (!this._isGestureListener && !params.event) {
      return;
    }
    const event = this._isGestureListener ? params : params.event.clone();
    this._zoomableTrigger.parserZoomEvent(event);
    // FIXME: event类型目前不全
    const { zoomDelta, zoomX, zoomY } = event as any;
    if (isNil(zoomDelta)) {
      return;
    }
    if (
      !pointInRect(
        {
          x: zoomX,
          y: zoomY
        },
        this._getRegionOrSeriesLayout(regionOrSeries),
        false
      )
    ) {
      return;
    }
    this._clickEnable = false;

    if (callback) {
      // zoomDelta, zoomX, zoomY can be changed in the callback
      callback({ zoomDelta, zoomX, zoomY }, event);
    }
    this._eventObj.emit('zoom', {
      scale: event.zoomDelta,
      scaleCenter: { x: event.zoomX, y: event.zoomY },
      model: this
    } as unknown as ExtendEventParam);
  }

  private _getRegionOrSeriesLayout(rs: IRegion | ISeries) {
    if (rs.type !== 'region') {
      rs = (<ISeries>rs).getRegion();
    }
    const { x, y, width, height } = rs.layout.getLayout();
    return {
      x1: x,
      y1: y,
      x2: x + width,
      y2: y + height
    };
  }

  private _bindZoomEventAsRegion(
    eventObj: IEvent,
    regionOrSeries: IRegion | ISeries,
    callback?: (params: { zoomDelta: number; zoomX: number; zoomY: number }, e: BaseEventParams['event']) => void,
    option?: ITriggerOption
  ) {
    const delayType = option?.delayType ?? 'throttle';
    const delayTime = option?.delayTime ?? 0;

    const event = this._isGestureListener ? this._gestureController : eventObj;
    const zoomParams = this._isGestureListener
      ? [this._getTriggerEvent('zoom')]
      : [this._getTriggerEvent('zoom'), { level: Event_Bubble_Level.chart, consume: true }];
    const zoomEndParams: [string] | [string, EventQuery] = this._isGestureListener
      ? [this._getTriggerEvent('zoomEnd')]
      : [this._getTriggerEvent('zoomEnd'), { level: Event_Bubble_Level.chart, consume: false }];

    // pc端没有scrollEnd事件，所以漫游模式下scroll仅支持realTime
    (event as any).on(
      ...zoomEndParams,
      delayMap[delayType]((params: BaseEventParams) => {
        this._zoomableTrigger.clearZoom();
      }, delayTime) as any
    );

    (event as any).on(
      ...zoomParams,
      delayMap[delayType]((params: BaseEventParams) => {
        // if (realTime) {
        this._zoomEventDispatch(params, regionOrSeries, callback);
        // }
      }, delayTime) as any
    );
  }

  initZoomEventOfSeries(
    s: ISeries,
    callback?: (params: { zoomDelta: number; zoomX: number; zoomY: number }, e: BaseEventParams['event']) => void,
    option?: ITriggerOption
  ) {
    if (this._option.disableTriggerEvent) {
      return;
    }
    if (getDefaultTriggerEventByMode(this._renderMode)) {
      this._bindZoomEventAsRegion(s.event, s, callback, option);
    }
  }

  initZoomEventOfRegions(
    regions: IRegion[],
    filter?: (s: ISeries) => boolean,
    callback?: (params: { zoomDelta: number; zoomX: number; zoomY: number }, e: BaseEventParams['event']) => void,
    option?: ITriggerOption
  ) {
    if (this._option.disableTriggerEvent) {
      return;
    }
    if (getDefaultTriggerEventByMode(this._renderMode)) {
      regions.forEach(r => {
        if (filter) {
          r.getSeries().forEach(s => {
            if (filter(s)) {
              this._bindZoomEventAsRegion(s.event, s, callback, option);
            }
          });
        } else {
          this._bindZoomEventAsRegion(this._eventObj, r, callback, option);
        }
      });
    }
  }

  private _scrollEventDispatch(
    params: BaseEventParams,
    regionOrSeries: IRegion | ISeries,
    callback?: (params: { scrollX: number; scrollY: number }, e: BaseEventParams['event']) => void
  ) {
    if (!this._isGestureListener && (!params.event || this._option.disableTriggerEvent)) {
      return;
    }
    const event = this._isGestureListener ? params : params.event;
    this._zoomableTrigger.parserScrollEvent(event);
    // FIXME: event类型目前不全
    const { scrollX, scrollY, canvasX, canvasY } = event as any;
    if (isNil(scrollX) && isNil(scrollY)) {
      return;
    }
    if (
      !pointInRect(
        {
          x: canvasX,
          y: canvasY
        },
        this._getRegionOrSeriesLayout(regionOrSeries),
        false
      )
    ) {
      return;
    }
    this._clickEnable = false;

    if (callback) {
      callback({ scrollX, scrollY }, event as any);
    }
    this._eventObj.emit('scroll', {
      scrollX,
      scrollY,
      model: this
    } as unknown as ExtendEventParam);
  }

  private _bindScrollEventAsRegion(
    eventObj: IEvent,
    regionOrSeries: IRegion | ISeries,
    callback?: (params: { scrollX: number; scrollY: number }, e: BaseEventParams['event']) => void,
    option?: ITriggerOption
  ) {
    const delayType = option?.delayType ?? 'throttle';
    const delayTime = option?.delayTime ?? 0;

    const event = this._isGestureListener ? this._gestureController : eventObj;
    const scrollParams = this._isGestureListener
      ? [this._getTriggerEvent('scroll')]
      : [this._getTriggerEvent('scroll'), { level: Event_Bubble_Level.chart, consume: true }];
    const scrollEndParams = this._isGestureListener
      ? [this._getTriggerEvent('scrollEnd')]
      : [this._getTriggerEvent('scrollEnd'), { level: Event_Bubble_Level.chart, consume: false }];

    // pc端没有scrollEnd事件，所以漫游模式下scroll仅支持realTime
    (event as any).on(
      ...scrollEndParams,
      delayMap[delayType]((params: any) => {
        this._zoomableTrigger.clearScroll();
      }, delayTime)
    );

    (event as any).on(
      ...scrollParams,
      delayMap[delayType]((params: any) => {
        // if (realTime) {
        this._scrollEventDispatch(params, regionOrSeries, callback);
        // }
      }, delayTime)
    );
  }

  initScrollEventOfSeries(
    s: ISeries,
    callback?: (params: { scrollX: number; scrollY: number }, e: BaseEventParams['event']) => void,
    option?: ITriggerOption
  ) {
    if (getDefaultTriggerEventByMode(this._renderMode)) {
      this._bindScrollEventAsRegion(s.event, s, callback, option);
    }
  }

  initScrollEventOfRegions(
    regions: IRegion[],
    filter?: (s: ISeries) => boolean,
    callback?: (params: { scrollX: number; scrollY: number }, e: BaseEventParams['event']) => void,
    option?: ITriggerOption
  ) {
    if (this._option.disableTriggerEvent) {
      return;
    }
    if (getDefaultTriggerEventByMode(this._renderMode)) {
      regions.forEach(r => {
        if (filter) {
          r.getSeries().forEach(s => {
            if (filter(s)) {
              this._bindScrollEventAsRegion(s.event, s, callback, option);
            }
          });
        } else {
          this._bindScrollEventAsRegion(this._eventObj, r, callback, option);
        }
      });
    }
  }

  private _bindDragEventAsRegion(
    eventObj: IEvent,
    regionOrSeries: IRegion | ISeries,
    callback?: (delta: [number, number], e: BaseEventParams['event']) => void,
    option?: ITriggerOption
  ) {
    eventObj.on(this._getTriggerEvent('start'), { level: Event_Bubble_Level.chart }, (params: any) => {
      if (!params.event) {
        return;
      }

      const { event } = params;
      const shouldTrigger = pointInRect(
        {
          x: event.canvasX,
          y: event.canvasY
        },
        this._getRegionOrSeriesLayout(regionOrSeries),
        false
      );
      if (shouldTrigger) {
        this._handleDrag(params, callback, option);
      }
    });
    // click 事件需要在drag和zoom时被屏蔽
    // hack 应该由事件系统做？或者事件系统有更好的方式处理这种交互冲突场景
    eventObj.on('click', { level: Event_Bubble_Level.chart }, () => {
      return !this._clickEnable;
    });
  }

  initDragEventOfSeries(
    s: ISeries,
    callback?: (delta: [number, number], e: BaseEventParams['event']) => void,
    option?: ITriggerOption
  ) {
    if (this._option.disableTriggerEvent) {
      return;
    }
    if (getDefaultTriggerEventByMode(this._renderMode)) {
      s.event.on(
        this._getTriggerEvent('start'),
        { level: Event_Bubble_Level.model, filter: ({ model }) => model?.id === s.id },
        params => {
          this._handleDrag(params, callback, option);
        }
      );
    }
  }

  initDragEventOfRegions(
    regions: IRegion[],
    filter?: (s: ISeries) => boolean,
    callback?: (delta: [number, number], e: BaseEventParams['event']) => void,
    option?: ITriggerOption
  ) {
    if (this._option.disableTriggerEvent) {
      return;
    }
    if (getDefaultTriggerEventByMode(this._renderMode)) {
      regions.forEach(r => {
        if (filter) {
          r.getSeries().forEach(s => {
            if (filter(s)) {
              s.event.on(
                this._getTriggerEvent('start'),
                { level: Event_Bubble_Level.model, filter: ({ model }) => model?.id === s.id },
                params => {
                  this._handleDrag(params, callback);
                }
              );

              // click 事件需要在drag和zoom时被屏蔽
              // hack 应该由事件系统做？或者事件系统有更好的方式处理这种交互冲突场景
              s.event.on(
                'click',
                { level: Event_Bubble_Level.model, filter: ({ model }) => model?.id === s.id },
                () => {
                  return !this._clickEnable;
                }
              );
            }
          });
        } else {
          this._bindDragEventAsRegion(this._eventObj, r, callback, option);
        }
      });
    }
  }

  protected _handleDrag(
    params: ExtendEventParam,
    callback?: (delta: [number, number], e: BaseEventParams['event']) => void,
    option?: ITriggerOption
  ) {
    if (this._option.disableTriggerEvent) {
      return;
    }
    this._clickEnable = true;
    if (!this._zoomableTrigger.parserDragEvent(params.event)) {
      return;
    }
    const delayType = option?.delayType ?? 'throttle';
    const delayTime = option?.delayTime ?? 0;
    const realTime = option?.realTime ?? true;
    const move = this._getTriggerEvent('move');
    const end = this._getTriggerEvent('end');
    const event = params.event;
    let moveX = event.canvasX;
    let moveY = event.canvasY;
    let upX = event.canvasX;
    let upY = event.canvasY;

    const mouseup = delayMap[delayType]((params: BaseEventParams) => {
      this._clickEnable = false;
      const event = params.event as any;
      const dx = event.canvasX - upX;
      const dy = event.canvasY - upY;
      const delta: [number, number] = [dx, dy];

      upX = event.canvasX;
      upY = event.canvasY;

      if (!realTime && callback) {
        callback(delta, params.event);
      }

      this._eventObj.emit('panend', {
        delta,
        model: this
      } as unknown as BaseEventParams);
      this._zoomableTrigger.pointerId = null;
      this._eventObj.off(move, { level: Event_Bubble_Level.chart, source: Event_Source_Type.chart }, mousemove as any);
      this._eventObj.off(end, { level: Event_Bubble_Level.chart, source: Event_Source_Type.window }, mouseup as any);
    }, delayTime);
    const mousemove = delayMap[delayType]((params: BaseEventParams) => {
      if (!this._zoomableTrigger.parserDragEvent(params.event)) {
        return;
      }
      this._clickEnable = false;
      const event = params.event;
      const dx = event.canvasX - moveX;
      const dy = event.canvasY - moveY;
      const delta: [number, number] = [dx, dy];

      moveX = event.canvasX;
      moveY = event.canvasY;

      if (realTime && callback) {
        callback(delta, params.event);
      }
      this._eventObj.emit('panmove', {
        delta,
        model: this
      } as unknown as ExtendEventParam);
    }, delayTime);

    this._eventObj.on(move, { level: Event_Bubble_Level.chart, source: Event_Source_Type.chart }, mousemove as any);
    this._eventObj.on(end, { level: Event_Bubble_Level.chart, source: Event_Source_Type.chart }, mouseup as any);
  }
}
