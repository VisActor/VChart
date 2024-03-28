import { ComponentTypeEnum } from '../interface/type';
import type { IModelLayoutOption, IModelRenderOption, IModelSpecInfo } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import { BaseComponent } from '../base/base-component';
import type { BaseEventParams, EventCallback, EventQuery, EventType } from '../../event/interface';
import type { ITooltipHandler, ITooltipLineActual, TooltipActiveType } from '../../typings/tooltip';
import type { Datum, IPoint, IShowTooltipOption } from '../../typings';
import { isMobileLikeMode, isTrueBrowser, isMiniAppLikeMode } from '../../util/env';
import type {
  ITooltip,
  ITooltipActiveTypeAsKeys,
  ITooltipSpec,
  TooltipHandlerParams,
  TotalMouseEventData
} from './interface';
import { TooltipResult } from './interface/common';
import { showTooltip } from './utils/show-tooltip';
import { isEmptyPos } from './utils/common';
import { isSameDimensionInfo } from '../../event/events/dimension/util/common';
import { ChartEvent, Event_Source_Type } from '../../constant';
import type { BaseTooltipProcessor, DimensionTooltipInfo, MarkTooltipInfo, TooltipInfo } from './processor';
// eslint-disable-next-line no-duplicate-imports
import { GroupTooltipProcessor, DimensionTooltipProcessor, MarkTooltipProcessor } from './processor';
import { isDimensionInfo, isMarkInfo } from './processor/util';
import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { hasParentElement, isArray, isValid, isNil, array } from '@visactor/vutils';
import { VChart } from '../../core/vchart';
import type { TooltipEventParams } from './interface/event';
import { Factory } from '../../core/factory';
import type { IGraphic } from '@visactor/vrender-core';
import { TooltipSpecTransformer } from './tooltip-transformer';
import { error } from '../../util';
import { TooltipHandlerType } from './constant';

export type TooltipActualTitleContent = {
  title?: ITooltipLineActual;
  content?: ITooltipLineActual[];
};

type EventHandlerList = {
  eventType: EventType;
  handler: any;
}[];

export class Tooltip extends BaseComponent<any> implements ITooltip {
  protected layoutZIndex: number = 1;
  static type = ComponentTypeEnum.tooltip;
  static readonly transformerConstructor = TooltipSpecTransformer;
  type = ComponentTypeEnum.tooltip;
  name: string = ComponentTypeEnum.tooltip;
  readonly transformerConstructor = TooltipSpecTransformer;

  static specKey = 'tooltip';
  specKey = 'tooltip';

  layoutType: 'none' = 'none';

  protected declare _spec: ITooltipSpec;

  static getSpecInfo(chartSpec: any): Maybe<IModelSpecInfo[]> {
    const tooltipSpec = chartSpec[this.specKey];
    if (!tooltipSpec) {
      return null;
    }
    if (!isArray(tooltipSpec)) {
      return [
        {
          spec: tooltipSpec,
          specPath: [this.specKey],
          specInfoPath: ['component', this.specKey, 0],
          type: ComponentTypeEnum.tooltip
        }
      ];
    }
    const specInfos: IModelSpecInfo[] = [];
    tooltipSpec.forEach((s: any, i: number) => {
      specInfos.push({
        spec: s,
        specPath: [this.specKey, i],
        specInfoPath: ['component', this.specKey, i],
        type: ComponentTypeEnum.tooltip
      });
    });
    return specInfos;
  }

  tooltipHandler?: ITooltipHandler;

  private _alwaysShow: boolean = false;

  private _cacheInfo: TooltipInfo | undefined;
  private _cacheParams: BaseEventParams | undefined;
  private _cacheActiveType: TooltipActiveType | undefined;

  private _eventList: EventHandlerList = [];

  protected _processor: ITooltipActiveTypeAsKeys<
    MarkTooltipProcessor,
    DimensionTooltipProcessor,
    GroupTooltipProcessor
  >;

  protected _isTooltipShown: boolean = false;

  protected _clickLock: boolean = false;

  /** 当前是否正在显示 tooltip */
  isTooltipShown() {
    return this._isTooltipShown;
  }

  changeRegions(regions: IRegion[]) {
    /* do nothing */
  }
  protected _getNeedClearVRenderComponents(): IGraphic[] {
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
      const type = renderMode === 'canvas' ? TooltipHandlerType.canvas : TooltipHandlerType.dom;
      const handlerConstructor = Factory.getComponentPluginInType(type);
      if (!handlerConstructor) {
        error('Can not find tooltip handler: ' + type);
      }
      const handler = new handlerConstructor();
      handler.name = `${this._spec.className}-${this._option.globalInstance.id ?? 0}-${this.getSpecIndex()}`;
      this.pluginService?.load([handler]);

      this.tooltipHandler = handler as unknown as ITooltipHandler;
    }
  }

  protected _initProcessor() {
    // 初始化 tooltip 类型
    this._processor = {
      mark: new MarkTooltipProcessor(this),
      dimension: new DimensionTooltipProcessor(this),
      group: new GroupTooltipProcessor(this)
    };
  }

  protected _initEvent() {
    if (this._option.disableTriggerEvent) {
      return;
    }
    const trigger = array(this._spec.trigger ?? 'hover');
    // TODO: triggerOff完整支持
    // const triggerOff = this._spec.triggerOff ?? trigger;
    const mode = this._option.mode;

    if (trigger.includes('hover')) {
      this._mountEvent('pointermove', { source: 'chart' }, this._getMouseMoveHandler(false));
      // 移动端的点按 + 滑动触发
      if (isMobileLikeMode(mode) || isMiniAppLikeMode(mode)) {
        this._mountEvent('pointerdown', { source: 'chart' }, this._getMouseMoveHandler(false));
        this._mountEvent('pointerup', { source: 'window' }, this._getMouseOutHandler(true));
      }
      this._mountEvent('pointerout', { source: 'canvas' }, this._getMouseOutHandler(false));
    }
    if (trigger.includes('click')) {
      this._mountEvent('pointertap', { source: 'chart' }, this._getMouseMoveHandler(true));
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

    const browserEnv = isTrueBrowser(this._option?.mode);
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
        ...(params as any),
        tooltip: this
      });
      this._cacheInfo = undefined;
      this._cacheParams = undefined;
      this._cacheActiveType = undefined;
    }
  };

  protected _getMouseMoveHandler = (isClick: boolean) => (params: BaseEventParams) => {
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
    if (!isClick && this._clickLock) {
      return;
    }

    /* 获取 tooltip 原始数据 */
    const mouseEventData = this._getMouseEventData(params);
    const {
      tooltipInfo: { dimension: dimensionInfo },
      ignore: { mark: ignoreMark, dimension: ignoreDimension }
    } = mouseEventData;

    /** tooltip 是否显示成功 */
    const success: ITooltipActiveTypeAsKeys<boolean, boolean, boolean> = {
      mark: false,
      dimension: false,
      group: false
    };

    /* 显示常规tooltip */
    success.group = this._showTooltipByMouseEvent('group', mouseEventData, params, isClick);
    if (!success.group) {
      success.mark = this._showTooltipByMouseEvent('mark', mouseEventData, params, isClick);
    }
    if (!success.mark && !success.group) {
      success.dimension = this._showTooltipByMouseEvent('dimension', mouseEventData, params, isClick);
    }

    /* 如果不是常规情况，进行一些特殊情况tooltip处理 */
    if (Object.values(success).every(val => !val) && !isEmptyPos(params)) {
      // 用户手动配置ignore，则继续显示缓存tooltip
      if (ignoreMark && isMarkInfo(this._cacheInfo)) {
        success.mark = this._showTooltipByMouseEvent('mark', mouseEventData, params, isClick, true);
      } else if (ignoreDimension && isDimensionInfo(this._cacheInfo)) {
        success.dimension = this._showTooltipByMouseEvent('dimension', mouseEventData, params, isClick, true);
      } else if (isValid(dimensionInfo)) {
        // 用户没有手动配置ignore的话，默认显示dimension tooltip
        success.dimension = this._showTooltipByMouseEvent('dimension', mouseEventData, params, isClick);
      }
    }

    /* 如果还是不应该显示tooltip，则隐藏上一次tooltip */
    if (!success.mark && !success.group && (!success.dimension || isNil(dimensionInfo))) {
      this._handleChartMouseOut(params);
      if (isClick && this._clickLock) {
        this._clickLock = false;
      }
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
    isClick: boolean,
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
      const isSameAsCache = this._isSameAsCache(tooltipInfo, params, activeType);
      success = !processor.showTooltip(tooltipInfo as any, params, isSameAsCache);
      if (success) {
        // 成功显示 tooltip，则更新缓存
        this._cacheInfo = tooltipInfo;
        this._cacheParams = params;
        this._cacheActiveType = activeType;
      }
    }
    if (success) {
      this._isTooltipShown = true;
      if (isClick && this._spec.lockAfterClick && !this._clickLock) {
        this._clickLock = true;
      }
    }
    // 全局唯一 tooltip
    const vchart = this._option?.globalInstance;
    if (success && VChart.globalConfig.uniqueTooltip && vchart) {
      VChart.hideTooltip(vchart.id);
    }
    return success;
  };

  protected _getMouseEventData = (params: BaseEventParams): TotalMouseEventData => {
    const result: TotalMouseEventData = {
      tooltipInfo: {},
      ignore: {}
    };

    let activeType: TooltipActiveType = 'dimension';
    const { tooltipInfo, ignore } = this._processor[activeType].getMouseEventData(params);
    result.tooltipInfo[activeType] = tooltipInfo as any;
    result.ignore[activeType] = ignore;

    const dimensionInfo = tooltipInfo as DimensionTooltipInfo;

    for (activeType of Object.keys(this._processor) as any) {
      if (activeType !== 'dimension') {
        const { tooltipInfo, ignore } = this._processor[activeType].getMouseEventData(params, dimensionInfo);
        result.tooltipInfo[activeType] = tooltipInfo as any;
        result.ignore[activeType] = ignore;
      }
    }
    return result;
  };

  protected _hideTooltipByHandler = (params: TooltipHandlerParams): TooltipResult => {
    if (!this._isTooltipShown && !this.tooltipHandler?.isTooltipShown?.()) {
      // 如果当前 tooltip 未显示，则提前退出
      return TooltipResult.success;
    }

    // 触发事件
    this.event.emit(ChartEvent.tooltipHide, {
      ...params,
      source: Event_Source_Type.chart, // 统一 event 的来源
      tooltip: this
    });

    // 删除缓存
    Object.values(this._processor).forEach((processor: BaseTooltipProcessor) => {
      processor.clearCache();
    });

    // 隐藏 tooltip
    let hideTooltip;
    if (this._spec.handler?.hideTooltip) {
      hideTooltip = this._spec.handler.hideTooltip.bind(this._spec.handler);
    } else if (this.tooltipHandler?.hideTooltip) {
      hideTooltip = this.tooltipHandler.hideTooltip.bind(this.tooltipHandler);
    }
    if (hideTooltip) {
      const result = hideTooltip(params);
      if (!result) {
        this._isTooltipShown = false;
      }
      return result;
    }
    return TooltipResult.failed;
  };

  reInit(spec?: any) {
    super.reInit(spec);

    if (this.tooltipHandler) {
      this.tooltipHandler.reInit?.();
    } else {
      this._initHandler();
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
      tooltip: this,
      item: undefined,
      datum: undefined,
      source: Event_Source_Type.chart
    } as any;

    this._alwaysShow = false;
    return !this._hideTooltipByHandler(params);
  }

  private _isSameAsCache(
    nextInfo?: TooltipInfo,
    nextParams?: BaseEventParams,
    nextActiveType?: TooltipActiveType
  ): boolean {
    if (nextActiveType !== this._cacheActiveType) {
      return false;
    }
    if (nextInfo === this._cacheInfo) {
      return true;
    }
    if (isNil(this._cacheInfo) || isNil(nextInfo)) {
      return false;
    }

    // 判断 tooltip 信息是否一致
    if (isDimensionInfo(nextInfo)) {
      if (isMarkInfo(this._cacheInfo)) {
        return false;
      }

      const prevInfo = this._cacheInfo as DimensionTooltipInfo;
      const isSameAsCacheInfo =
        prevInfo.length === nextInfo.length && nextInfo.every((info, i) => isSameDimensionInfo(info, prevInfo[i]));
      if (!isSameAsCacheInfo) {
        return false;
      }
    } else {
      if (isDimensionInfo(this._cacheInfo)) {
        return false;
      }

      const prevInfo = this._cacheInfo as MarkTooltipInfo;
      const isSameAsCacheInfo =
        nextInfo?.datum === prevInfo.datum && nextInfo?.mark === prevInfo.mark && nextInfo?.series === prevInfo.series;
      if (!isSameAsCacheInfo) {
        return false;
      }
    }

    // 判断事件触发信息是否一致
    const prevParams = this._cacheParams;
    if (isNil(prevParams) || isNil(nextParams)) {
      return false;
    }
    return (
      prevParams.mark === nextParams.mark &&
      prevParams.model === nextParams.model &&
      prevParams.datum === nextParams.datum
    );
  }

  private _isPointerInChart(point: IPoint): boolean {
    const globalInstance = this._option?.globalInstance;
    if (!globalInstance) {
      return false;
    }
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
      let newTarget: any;
      if (isValid(event.nativeEvent)) {
        // get native event object
        const nativeEvent = event.nativeEvent as any;
        newTarget = nativeEvent.relatedTarget;
        // if in shadow DOM use composedPath to access target
        // FIXME: shadow DOM 的 relatedTarget 的属性是？
        if (nativeEvent.composedPath && nativeEvent.composedPath().length > 0) {
          newTarget = nativeEvent.composedPath()[0];
        }
      } else {
        newTarget = event.relatedTarget;
      }
      const container = this.tooltipHandler?.getTooltipContainer?.();
      if (isValid(container) && isValid(newTarget) && hasParentElement(newTarget, container)) {
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
