import type { IComponentOption } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { ComponentTypeEnum } from '../interface';
import type { IModelLayoutOption, IModelRenderOption, ILayoutItem } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import { BaseComponent } from '../base';
import type { BaseEventParams, EventCallback, EventQuery, EventType } from '../../event/interface';
import type { ITooltipHandler, IToolTipLineActual, TooltipActiveType } from '../../typings/tooltip';
import { DomTooltipHandler, CanvasTooltipHandler } from './handler';
import type { Datum, IPoint, IShowTooltipOption } from '../../typings';
import {
  cloneDeep,
  isArray,
  isValid,
  merge,
  isMobileLikeMode,
  isTrueBrowser,
  isNil,
  isMiniAppLikeMode
} from '../../util';
import type {
  ITooltipActiveTypeAsKeys,
  ITooltipSpec,
  ITooltipTheme,
  TooltipHandlerParams,
  TotalMouseEventData
} from './interface';
import { TOOLTIP_EL_CLASS_NAME } from './handler/constants';
// eslint-disable-next-line no-duplicate-imports
import { getTooltipActualActiveType, showTooltip, isEmptyPos } from './utils';
import { isSameDimensionInfo } from '../../event/events/dimension/util';
import { Event_Bubble_Level, Event_Source_Type } from '../../constant';
import type { DimensionTooltipInfo, MarkTooltipInfo, TooltipInfo } from './processor';
// eslint-disable-next-line no-duplicate-imports
import { isDimensionInfo, isMarkInfo, MarkTooltipProcessor, DimensionTooltipProcessor } from './processor';
import { getElementAbsolutePosition, getElementAbsoluteScrollOffset, hasParentElement } from '@visactor/vutils';

export type TooltipContent = {
  title?: IToolTipLineActual;
  content?: IToolTipLineActual[];
};

export class Tooltip extends BaseComponent {
  static type = ComponentTypeEnum.tooltip;
  type = ComponentTypeEnum.tooltip;
  name: string = ComponentTypeEnum.tooltip;

  layoutType: ILayoutItem['layoutType'] = 'absolute';

  static createComponent(spec: any, options: IComponentOption) {
    const tooltipSpec = spec.tooltip;
    if (!tooltipSpec) {
      return null;
    }
    if (!isArray(tooltipSpec)) {
      return new Tooltip(tooltipSpec, { ...options, specKey: 'tooltip' });
    }
    const tooltips: Tooltip[] = [];
    tooltipSpec.forEach((s: any, i: number) => {
      tooltips.push(new Tooltip(s, { ...options, specIndex: i, specKey: 'tooltip' }));
    });
    return tooltips;
  }

  tooltipHandler?: ITooltipHandler;

  private _alwaysShow: boolean = false;

  private _cacheInfo: TooltipInfo | undefined;

  private _eventList: {
    eventType: EventType;
    handler: any;
  }[] = [];

  protected declare _spec: ITooltipSpec;

  protected declare _theme: ITooltipTheme;

  protected _processor: ITooltipActiveTypeAsKeys<MarkTooltipProcessor, DimensionTooltipProcessor>;

  changeRegions(regions: IRegion[]) {
    /* do nothing */
  }
  protected registerEvent() {
    /* do nothing */
  }
  protected releaseEvent() {
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
    // handler
    this.initHandler();
    // processor
    this.initProcessor();
    // event
    this.initEvent();
  }

  release() {
    super.release();

    this._eventList.forEach(({ eventType, handler }) => {
      this.event.off(eventType, handler);
    });
    this._eventList = [];
    this.tooltipHandler?.release?.();
  }

  protected initHandler() {
    const renderMode = this._spec.renderMode ?? 'html';

    const userTooltipHandler = this._option.globalInstance.getTooltipHandlerByUser();
    if (userTooltipHandler) {
      this.tooltipHandler = userTooltipHandler;
    } else {
      // 构造内部默认 handler
      const Handler = renderMode === 'canvas' ? CanvasTooltipHandler : DomTooltipHandler;
      const id = `${this._spec.className}-${this._option.globalInstance.id ?? 0}-${this._option.specIndex ?? 0}`;
      this.tooltipHandler = new Handler(
        this._spec,
        id,
        this._option.mode,
        this._option.globalInstance.getContainer(),
        this.getCompiler(),
        this._option
      );
    }
  }

  protected initProcessor() {
    // 初始化 tooltip 类型
    this._processor = {
      mark: new MarkTooltipProcessor(this),
      dimension: new DimensionTooltipProcessor(this)
    };
  }

  protected initEvent() {
    const trigger = this._spec.trigger ?? 'hover';
    // TODO: triggerOff完整支持
    // const triggerOff = this._spec.triggerOff ?? trigger;
    const mode = this._option.mode;

    if (trigger === 'hover') {
      this.mountEvent('pointermove', { level: Event_Bubble_Level.chart }, this.handleMouseMove);
      this.mountEvent('pointerleave', { level: Event_Bubble_Level.chart }, this.handleMouseOut);
      // TODO: 需要封装一个复合事件，用于移动端的点按+滑动触发
      if (isMobileLikeMode(mode) || isMiniAppLikeMode(mode)) {
        this.mountEvent('pointerdown', { level: Event_Bubble_Level.chart }, this.handleMouseMove);
      }
    } else if (trigger === 'click') {
      this.mountEvent('pointertap', { level: Event_Bubble_Level.chart }, this.handleMouseMove);
    }
  }

  protected mountEvent = (eType: EventType, query: EventQuery, callback: EventCallback<any>) => {
    this.event.on(eType, query, callback);
    this._eventList.push({
      eventType: eType,
      handler: callback
    });
  };

  protected handleMouseOut = (params: BaseEventParams) => {
    if (this._alwaysShow) {
      return;
    }

    // 当  enterable 为true，同时鼠标移入 tooltip 时 pointerleave 事件也会触发，所以这里做一个判断
    const { clientX, clientY } = params.event as MouseEvent;
    if (isTrueBrowser(this._option.mode) && this._isPointInChart({ x: clientX, y: clientY })) {
      return;
    }

    this.handleChartMouseOut(params);
  };

  protected handleChartMouseOut = (params: BaseEventParams) => {
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

  protected handleMouseMove = (params: BaseEventParams) => {
    if (this._alwaysShow) {
      return;
    }

    // TODO：后续支持 renderMode === 'canvas' 场景
    if (this._spec.enterable && this._spec.renderMode === 'html') {
      // get native event object
      const nativeEvent = params.event.nativeEvent;
      let target = nativeEvent.target;
      // if in shadow DOM use composedPath to access target
      if (nativeEvent.composedPath && nativeEvent.composedPath().length > 0) {
        target = nativeEvent.composedPath()[0];
      }

      const container = this.tooltipHandler?.getTooltipContainer?.();
      if (isValid(container) && hasParentElement(target, container)) {
        return;
      }
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
      this.handleChartMouseOut(params);
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

  protected _hideTooltipByHandler = (params: TooltipHandlerParams) => {
    if (this.tooltipHandler?.hideTooltip) {
      this.tooltipHandler.hideTooltip(params);
    }
  };

  protected _initTheme(theme?: any) {
    super._initTheme(theme);
    this._spec.style = merge({}, this._theme, this._originalSpec.style);
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
      this._spec.parentElement = userSpec.parentElement;
    } else if (isTrueBrowser(this._option.mode)) {
      this._spec.parentElement = globalThis.document?.body;
    }

    if (isValid(userSpec.confine)) {
      this._spec.confine = userSpec.confine;
    } else {
      this._spec.confine = this._spec.renderMode === 'canvas';
    }
  }

  showTooltip(datum: Datum, options: IShowTooltipOption) {
    if (!this.tooltipHandler?.showTooltip) {
      return false;
    }
    const result = showTooltip(datum, options, this.tooltipHandler, this._option);
    if (result !== 'none') {
      this._alwaysShow = !!options?.alwaysShow;
    }
    return result;
  }

  hideTooltip() {
    if (!this.tooltipHandler?.hideTooltip) {
      return false;
    }
    this._alwaysShow = false;
    this.tooltipHandler.hideTooltip({
      changePositionOnly: false,
      item: undefined,
      datum: undefined,
      source: Event_Source_Type.chart
    } as any);
    return true;
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
    return nextInfo.datum === prevInfo.datum && nextInfo.mark === prevInfo.mark && nextInfo.series === prevInfo.series;
  }

  private _isPointInChart(point: IPoint): boolean {
    const globalInstance = this._option.globalInstance;
    const chart = globalInstance.getChart();
    if (!chart) {
      return false;
    }
    const { x, y } = point;
    const container = globalInstance.getContainer();
    const { x: chartX, y: chartY } = getElementAbsolutePosition(container);
    const { x: scrollOffsetX, y: scrollOffsetY } = getElementAbsoluteScrollOffset(container);
    const canvasRect = chart.getCanvasRect();
    const chartWidth = canvasRect?.width;
    const chartHeight = canvasRect?.height;
    // 鼠标仍在图表范围内，则不处理
    if (
      x >= chartX - scrollOffsetX &&
      x <= chartX + chartWidth - scrollOffsetX &&
      y >= chartY - scrollOffsetY &&
      y <= chartY + chartHeight - scrollOffsetY
    ) {
      return true;
    }

    return false;
  }
}
