import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface/type';
import type { IModelLayoutOption, IModelRenderOption, ILayoutItem } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import { BaseComponent } from '../base/base-component';
import type { BaseEventParams, EventCallback, EventQuery, EventType } from '../../event/interface';
import type { ITooltipHandler, IToolTipLineActual, TooltipActiveType } from '../../typings/tooltip';
import { DomTooltipHandler } from './handler/dom';
import { CanvasTooltipHandler } from './handler/canvas';
import type { Datum, IPoint, IShowTooltipOption } from '../../typings';
import { isMobileLikeMode, isTrueBrowser, isMiniAppLikeMode, domDocument } from '../../util/env';
import { mergeSpec } from '../../util/spec/merge-spec';
import type {
  ITooltip,
  ITooltipActiveTypeAsKeys,
  ITooltipSpec,
  ITooltipTheme,
  TooltipHandlerParams,
  TotalMouseEventData
} from './interface';
import { TooltipResult } from './interface/common';
import { TOOLTIP_EL_CLASS_NAME } from './handler/constants';
import { showTooltip } from './utils/show-tooltip';
import { getTooltipActualActiveType, isEmptyPos } from './utils/common';
import { isSameDimensionInfo } from '../../event/events/dimension/util/common';
import { ChartEvent, Event_Bubble_Level, Event_Source_Type } from '../../constant';
import type { DimensionTooltipInfo, MarkTooltipInfo, TooltipInfo } from './processor';
// eslint-disable-next-line no-duplicate-imports
import { DimensionTooltipProcessor } from './processor/dimension-tooltip';
import { isDimensionInfo, isMarkInfo } from './processor/util';
import { MarkTooltipProcessor } from './processor/mark-tooltip';
import { hasParentElement, isString, cloneDeep, isArray, isValid, isNil } from '@visactor/vutils';
import { VChart } from '../../core/vchart';
import type { TooltipEventParams } from './interface/event';
import { Factory } from '../../core/factory';
import type { IGraphic } from '@visactor/vrender-core';

export type TooltipActualTitleContent = {
  title?: IToolTipLineActual;
  content?: IToolTipLineActual[];
};

type EventHandlerList = {
  eventType: EventType;
  handler: any;
}[];

export class Tooltip extends BaseComponent<any> implements ITooltip {
  static type = ComponentTypeEnum.tooltip;
  type = ComponentTypeEnum.tooltip;
  name: string = ComponentTypeEnum.tooltip;

  layoutType: ILayoutItem['layoutType'] = 'absolute';

  protected declare _spec: ITooltipSpec;

  static createComponent(spec: any, options: IComponentOption) {
    const tooltipSpec = spec.tooltip;
    if (!tooltipSpec) {
      return null;
    }
    if (!isArray(tooltipSpec)) {
      return new Tooltip(tooltipSpec, options);
    }
    const tooltips: Tooltip[] = [];
    tooltipSpec.forEach((s: any, i: number) => {
      tooltips.push(new Tooltip(s, { ...options, specIndex: i }));
    });
    return tooltips;
  }

  tooltipHandler?: ITooltipHandler;

  private _alwaysShow: boolean = false;

  private _cacheInfo: TooltipInfo | undefined;

  private _eventList: EventHandlerList = [];

  protected declare _theme: ITooltipTheme;

  protected _processor: ITooltipActiveTypeAsKeys<MarkTooltipProcessor, DimensionTooltipProcessor>;

  protected _isTooltipShown: boolean = false;
  /** 当前是否正在显示 tooltip */
  isTooltipShown() {
    return this._isTooltipShown;
  }

  changeRegions(regions: IRegion[]) {
    /* do nothing */
  }
  getVRenderComponents(): IGraphic[] {
    return [];
  }
  protected _registerEvent() {
    /* do nothing */
  }
  protected _releaseEvent() {
    /* do nothing */
  }
  onLayout(ctx: IModelLayoutOption) {
    /* do nothing */
  }
  onLayoutEnd(ctx: IModelLayoutOption) {
    /* do nothing */
  }
  onRender(ctx: IModelRenderOption) {
    /* do nothing */
  }

  created() {
    super.created();
    this._regions = this._option.getAllRegions();
    // event
    this._initEvent();
  }

  release() {
    super.release();

    this._eventList.forEach(({ eventType, handler }) => {
      this.event.off(eventType, handler);
    });
    this._eventList = [];
    this.tooltipHandler?.release?.();
    this._isTooltipShown = false;
  }

  beforeRelease() {
    // 触发事件
    this.event.emit(ChartEvent.tooltipHide, {
      tooltip: this
    } as unknown as TooltipEventParams);
    this.event.emit(ChartEvent.tooltipRelease, {
      tooltip: this
    } as unknown as TooltipEventParams);
  }

  protected _initHandler() {
    const renderMode = this._spec.renderMode ?? 'html';

    const userTooltipHandler = this._option.globalInstance.getTooltipHandlerByUser();
    if (userTooltipHandler) {
      this.tooltipHandler = userTooltipHandler;
    } else {
      // 构造内部默认 handler
      const Handler = renderMode === 'canvas' ? CanvasTooltipHandler : DomTooltipHandler;
      const id = `${this._spec.className}-${this._option.globalInstance.id ?? 0}-${this._option.specIndex ?? 0}`;
      this.tooltipHandler = new Handler(id, this);
    }
  }

  protected _initProcessor() {
    // 初始化 tooltip 类型
    this._processor = {
      mark: new MarkTooltipProcessor(this),
      dimension: new DimensionTooltipProcessor(this)
    };
  }

  protected _initEvent() {
    const trigger = this._spec.trigger ?? 'hover';
    // TODO: triggerOff完整支持
    // const triggerOff = this._spec.triggerOff ?? trigger;
    const mode = this._option.mode;

    if (trigger === 'hover') {
      this._mountEvent('pointermove', { level: Event_Bubble_Level.chart }, this._handleMouseMove);
      // 移动端的点按 + 滑动触发
      if (isMobileLikeMode(mode) || isMiniAppLikeMode(mode)) {
        this._mountEvent('pointerdown', { level: Event_Bubble_Level.chart }, this._handleMouseMove);
        this._mountEvent('pointerup', { source: 'window' }, this._getMouseOutHandler(true));
      }
      this._mountEvent('pointerout', { source: 'canvas' }, this._getMouseOutHandler(false));
    } else if (trigger === 'click') {
      this._mountEvent('pointertap', { level: Event_Bubble_Level.chart }, this._handleMouseMove);
      this._mountEvent('pointerup', { source: 'window' }, this._getMouseOutHandler(true));
    }
  }

  protected _mountEvent = (eType: EventType, query: EventQuery, callback: EventCallback<any>) => {
    this.event.on(eType, query, callback);
    this._eventList.push({
      eventType: eType,
      handler: callback
    });
  };

  protected _getMouseOutHandler = (needPointerDetection?: boolean) => (params: BaseEventParams) => {
    if (this._alwaysShow) {
      return;
    }

    if (!this._isTooltipShown && !this.tooltipHandler?.isTooltipShown?.()) {
      return;
    }

    const browserEnv = isTrueBrowser(this._option.mode);
    const { clientX, clientY } = params.event as MouseEvent;

    // 当 enterable 为 true，同时鼠标移入 tooltip 时 pointerleave 事件也会触发，所以这里做一个判断
    if (browserEnv && this._isPointerOnTooltip(params)) {
      return;
    }

    // 判断鼠标是否在图表范围内
    if (browserEnv && needPointerDetection && this._isPointerInChart({ x: clientX, y: clientY })) {
      return;
    }

    this._handleChartMouseOut(params);
  };

  protected _handleChartMouseOut = (params: BaseEventParams) => {
    if (this._alwaysShow) {
      return;
    }

    if (this._spec.triggerOff !== 'none') {
      this._hideTooltipByHandler({
        ...params
      });
      this._cacheInfo = undefined;
    }
  };

  protected _handleMouseMove = (params: BaseEventParams) => {
    if (!this.tooltipHandler) {
      this._initHandler();
    }

    if (!this._processor) {
      this._initProcessor();
    }

    if (this._alwaysShow) {
      return;
    }
    if (this._isPointerOnTooltip(params)) {
      return;
    }

    /* 获取 tooltip 原始数据 */
    const mouseEventData = this._getMouseEventData(params);
    const {
      tooltipInfo: { dimension: dimensionInfo },
      ignore: { mark: ignoreMark, dimension: ignoreDimension }
    } = mouseEventData;

    let markTooltipSuccess: boolean = false;
    let dimensionTooltipSuccess: boolean = false;

    /* 显示常规tooltip */
    markTooltipSuccess = this._showTooltipByMouseEvent('mark', mouseEventData, params);
    if (!markTooltipSuccess) {
      dimensionTooltipSuccess = this._showTooltipByMouseEvent('dimension', mouseEventData, params);
    }

    /* 如果不是常规情况，进行一些特殊情况tooltip处理 */
    if (!markTooltipSuccess && !dimensionTooltipSuccess && !isEmptyPos(params)) {
      // 用户手动配置ignore，则继续显示缓存tooltip
      if (ignoreMark && isMarkInfo(this._cacheInfo)) {
        markTooltipSuccess = this._showTooltipByMouseEvent('mark', mouseEventData, params, true);
      } else if (ignoreDimension && isDimensionInfo(this._cacheInfo)) {
        dimensionTooltipSuccess = this._showTooltipByMouseEvent('dimension', mouseEventData, params, true);
      } else if (isValid(dimensionInfo)) {
        // 用户没有手动配置ignore的话，默认显示dimension tooltip
        dimensionTooltipSuccess = this._showTooltipByMouseEvent('dimension', mouseEventData, params);
      }
    }

    /* 如果还是不应该显示tooltip，则隐藏上一次tooltip */
    if (!markTooltipSuccess && (!dimensionTooltipSuccess || isNil(dimensionInfo))) {
      this._handleChartMouseOut(params);
    }
  };

  /**
   * 通过鼠标事件触发 tooltip，返回是否成功
   * @param activeType tooltip 类型
   * @param mouseEventData tooltip 相关数据
   * @param params 事件参数
   * @param useCache 是否直接显示缓存 tooltip
   * @returns 是否成功执行
   */
  protected _showTooltipByMouseEvent = (
    activeType: TooltipActiveType,
    mouseEventData: TotalMouseEventData,
    params: BaseEventParams,
    useCache?: boolean
  ): boolean => {
    const processor = this._processor[activeType];
    // 判断是否应该触发 tooltip
    if (
      !processor.shouldHandleTooltip(params, {
        tooltipInfo: mouseEventData.tooltipInfo[activeType],
        ignore: mouseEventData.ignore[activeType]
      })
    ) {
      return false;
    }

    let success: boolean;
    if (useCache) {
      // 直接显示缓存 tooltip
      success = !processor.showTooltip(this._cacheInfo as any, params, true);
    } else {
      const tooltipInfo = mouseEventData.tooltipInfo[activeType];
      const isSameAsCache = this._isSameAsCacheInfo(tooltipInfo);
      success = !processor.showTooltip(tooltipInfo as any, params, isSameAsCache);
      if (success) {
        // 成功显示 tooltip，则更新缓存
        this._cacheInfo = tooltipInfo;
      }
    }
    if (success) {
      this._isTooltipShown = true;
    }
    // 全局唯一 tooltip
    const vchart = this._option.globalInstance;
    if (success && VChart.globalConfig.uniqueTooltip) {
      VChart.hideTooltip(vchart.id);
    }
    return success;
  };

  protected _getMouseEventData = (params: BaseEventParams): TotalMouseEventData => {
    const result: TotalMouseEventData = {
      tooltipInfo: {},
      ignore: {}
    };
    Object.keys(this._processor).forEach(activeType => {
      const { tooltipInfo, ignore } = this._processor[activeType].getMouseEventData(params);
      result.tooltipInfo[activeType] = tooltipInfo;
      result.ignore[activeType] = ignore;
    });
    return result;
  };

  protected _hideTooltipByHandler = (params: TooltipHandlerParams): TooltipResult => {
    if (!this._isTooltipShown && !this.tooltipHandler?.isTooltipShown?.()) {
      // 如果当前 tooltip 未显示，则提前退出
      return TooltipResult.success;
    }
    this.event.emit(ChartEvent.tooltipHide, {
      ...params,
      source: Event_Source_Type.chart, // 统一 event 的来源
      tooltip: this
    });
    if (this.tooltipHandler?.hideTooltip) {
      const result = this.tooltipHandler.hideTooltip(params);
      if (!result) {
        this._isTooltipShown = false;
      }
      return result;
    }
    return TooltipResult.failed;
  };

  protected _initTheme(theme?: any) {
    super._initTheme(theme);
    this._spec.style = this._prepareSpecAfterMergingTheme(mergeSpec({}, this._theme, this._originalSpec.style));
  }

  protected _shouldMergeThemeToSpec() {
    return false;
  }

  reInit(theme?: any) {
    super.reInit(theme);

    if (this.tooltipHandler) {
      this.tooltipHandler.reInit?.();
    } else {
      this._initHandler();
    }
  }

  setAttrFromSpec() {
    super.setAttrFromSpec();
    const userSpec = this._spec as ITooltipSpec;
    this._spec = {
      ...userSpec,
      visible: isValid(userSpec.visible) ? userSpec.visible : true,
      activeType: getTooltipActualActiveType(userSpec),
      renderMode: 'html',
      trigger: isValid(userSpec.trigger) ? userSpec.trigger : 'hover',
      className: isValid(userSpec.className) ? userSpec.className : TOOLTIP_EL_CLASS_NAME,
      enterable: isValid(userSpec.enterable) ? userSpec.enterable : false,
      transitionDuration: isValid(userSpec.transitionDuration) ? userSpec.transitionDuration : 150
    } as ITooltipSpec;
    this._spec.triggerOff = isValid(userSpec.triggerOff) ? userSpec.triggerOff : this._spec.trigger;

    if (isValid(userSpec.renderMode)) {
      this._spec.renderMode = userSpec.renderMode;
    } else if (isMiniAppLikeMode(this._option.mode)) {
      // 小程序环境下，默认使用canvas渲染
      this._spec.renderMode = 'canvas';
    }

    if (isValid(userSpec.mark)) {
      this._spec.mark = {
        ...cloneDeep(userSpec.mark),
        activeType: 'mark'
      };
    }
    if (isValid(userSpec.dimension)) {
      this._spec.dimension = {
        ...cloneDeep(userSpec.dimension),
        activeType: 'dimension'
      };
    }

    if (isValid(userSpec.parentElement)) {
      if (isString(userSpec.parentElement)) {
        this._spec.parentElement = globalThis.document?.getElementById(userSpec.parentElement);
      } else {
        this._spec.parentElement = userSpec.parentElement;
      }
    } else if (isTrueBrowser(this._option.mode)) {
      this._spec.parentElement = domDocument?.body;
    }

    if (isValid(userSpec.confine)) {
      this._spec.confine = userSpec.confine;
    } else {
      this._spec.confine = this._spec.renderMode === 'canvas';
    }
  }

  showTooltip(datum: Datum, options: IShowTooltipOption) {
    if (!this.tooltipHandler) {
      this._initHandler();
    }

    if (!this._processor) {
      this._initProcessor();
    }

    if (!this.tooltipHandler?.showTooltip) {
      return false;
    }
    const result = showTooltip(datum, options, this.tooltipHandler, this._option);
    if (result !== 'none') {
      this._alwaysShow = !!options?.alwaysShow;
    }
    return result;
  }

  /** 手动隐藏 tooltip，返回是否成功 */
  hideTooltip(): boolean {
    const params: TooltipHandlerParams = {
      changePositionOnly: false,
      item: undefined,
      datum: undefined,
      source: Event_Source_Type.chart
    } as any;

    this._alwaysShow = false;
    return !this._hideTooltipByHandler(params);
  }

  private _isSameAsCacheInfo(nextInfo?: TooltipInfo): boolean {
    if (nextInfo === this._cacheInfo) {
      return true;
    }
    if (isNil(this._cacheInfo) || isNil(nextInfo)) {
      return false;
    }

    if (isDimensionInfo(nextInfo)) {
      if (isMarkInfo(this._cacheInfo)) {
        return false;
      }

      const prevInfo = this._cacheInfo as DimensionTooltipInfo;
      return prevInfo.length === nextInfo.length && nextInfo.every((info, i) => isSameDimensionInfo(info, prevInfo[i]));
    }
    if (isDimensionInfo(this._cacheInfo)) {
      return false;
    }

    const prevInfo = this._cacheInfo as MarkTooltipInfo;
    return (
      nextInfo?.datum === prevInfo.datum && nextInfo?.mark === prevInfo.mark && nextInfo?.series === prevInfo.series
    );
  }

  private _isPointerInChart(point: IPoint): boolean {
    const globalInstance = this._option.globalInstance;
    const chart = globalInstance.getChart();
    if (!chart) {
      return false;
    }
    const { x, y } = point;
    const canvas = globalInstance.getCanvas();
    const { x: chartX, y: chartY, width: chartWidth, height: chartHeight } = canvas.getBoundingClientRect();
    // 鼠标仍在图表范围内，则不处理
    if (x >= chartX && x <= chartX + chartWidth && y >= chartY && y <= chartY + chartHeight) {
      return true;
    }

    return false;
  }

  private _isPointerOnTooltip(params: BaseEventParams): boolean {
    // TODO：后续支持 renderMode === 'canvas' 场景
    if (this._spec.enterable && this._spec.renderMode === 'html') {
      const { event } = params;
      let target: any;
      if (isValid(event.nativeEvent)) {
        // get native event object
        const nativeEvent = event.nativeEvent as Event;
        target = nativeEvent.target;
        // if in shadow DOM use composedPath to access target
        if (nativeEvent.composedPath && nativeEvent.composedPath().length > 0) {
          target = nativeEvent.composedPath()[0];
        }
      } else {
        target = event.target;
      }

      const container = this.tooltipHandler?.getTooltipContainer?.();
      if (isValid(container) && isValid(target) && hasParentElement(target, container)) {
        return true;
      }
    }
    return false;
  }

  getVisible() {
    return this._spec.visible !== false;
  }
}

export const registerTooltip = () => {
  Factory.registerComponent(Tooltip.type, Tooltip);
};
