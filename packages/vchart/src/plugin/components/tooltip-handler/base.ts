import { DEFAULT_CHART_WIDTH, DEFAULT_CHART_HEIGHT } from '../../../constant/base';
import type { Options } from './constants';
// eslint-disable-next-line no-duplicate-imports
import { DEFAULT_OPTIONS } from './constants';
import type { Maybe, IPoint, ILayoutPoint, RenderMode } from '../../../typings';
// eslint-disable-next-line no-duplicate-imports
import type { ITooltipPositionFixedValue } from '../../../typings/tooltip/position';
// eslint-disable-next-line no-duplicate-imports
import { isTrueBrowser } from '../../../util/env';
import type {
  TooltipData,
  ITooltipActual,
  TooltipActiveType,
  ITooltipHandler,
  ITooltipPositionActual,
  IGlobalTooltipPositionPattern
} from '../../../typings/tooltip';
// eslint-disable-next-line no-duplicate-imports
import type { TooltipFixedPosition } from '../../../typings/tooltip';
import { getScale } from './utils/common';
import {
  getActualTooltipPositionValue,
  getCartesianCrosshairRect,
  getHorizontalPositionType,
  getVerticalPositionType,
  isFixedTooltipPositionPattern,
  isGlobalTooltipPositionPattern
} from './utils/position';
import type { ICartesianSeries } from '../../../series/interface';
import type { IGroup } from '@visactor/vrender-core';
import type { AABBBounds } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import {
  isNumber,
  isObject,
  isValidNumber,
  isValid,
  throttle,
  isNil,
  polygonContainPoint,
  pointInRect,
  isFunction
} from '@visactor/vutils';
import type { IElement } from '@visactor/vgrammar-core';
import type { ILayoutModel } from '../../../model/interface';
import type { Compiler } from '../../../compile/compiler';
import type { IContainerSize } from '@visactor/vrender-components';
import { getTooltipAttributes } from './utils/attribute';
import type { IChartOption } from '../../../chart/interface';
import type { ITooltipSpec, Tooltip, TooltipHandlerParams } from '../../../component/tooltip';
// eslint-disable-next-line no-duplicate-imports
import { TooltipResult } from '../../../component/tooltip';
import type { IComponentPlugin, IComponentPluginService } from '../interface';
import { BasePlugin } from '../../base/base-plugin';
import type { ITooltipAttributes } from './interface';
import { getFirstSeries } from '../../../util';
import { getTooltipPatternValue } from '../../../component/tooltip/utils';

type ChangeTooltipFunc = (visible: boolean, params: TooltipHandlerParams, data?: TooltipData) => TooltipResult;

type ChangeTooltipPositionFunc = (params: TooltipHandlerParams, data: TooltipData) => TooltipResult;

/**
 * The tooltip handler class.
 */
export abstract class BaseTooltipHandler extends BasePlugin implements ITooltipHandler, IComponentPlugin {
  static readonly pluginType: 'component';
  static readonly specKey = 'tooltip';

  readonly type: string;

  /** 是否可见 */
  protected _visible = true;

  // protected _style: ITooltipStyle = {};

  protected _option: Options;

  protected _chartOption: IChartOption;

  protected _env: RenderMode;
  public get env() {
    return this._env;
  }

  protected _component: Tooltip;
  protected _attributes?: ITooltipAttributes | null = null;

  protected _chartContainer: Maybe<HTMLElement>;
  protected _compiler: Compiler;

  protected _isTooltipPaused: boolean;
  protected _isPointerEscaped: boolean;
  protected _cachePointerTimer: number;
  protected _cachePointerPosition: ILayoutPoint;
  protected _cacheTooltipPosition: ILayoutPoint;
  protected _cacheTooltipSize: IContainerSize;

  // tooltip 容器
  protected _container!: Maybe<IGroup | HTMLElement>;

  protected _isReleased: boolean = false;

  onAdd(service: IComponentPluginService<any>): void {
    super.onAdd(service);
    const component = service.component as Tooltip;
    this._component = component;
    this._chartOption = component.getOption() as any;
    this._env = this._chartOption.mode;
    this._chartContainer = this._chartOption.globalInstance.getContainer();
    this._compiler = component.getCompiler();
    this._initFromSpec();
  }

  showTooltip = (activeType: TooltipActiveType, data: TooltipData, params: TooltipHandlerParams) => {
    const { changePositionOnly } = params;

    if (changePositionOnly) {
      return this.changeTooltipPosition(params, data);
    }
    return this.changeTooltip(true, params, data);
  };

  /** 改变 tooltip 内容和位置（带 throttle 版本），返回是否遇到异常 */
  protected changeTooltip: ChangeTooltipFunc;

  /** 改变 tooltip 内容和位置（不带 throttle 版本），返回是否遇到异常 */
  protected _changeTooltip: ChangeTooltipFunc = (
    visible: boolean,
    params: TooltipHandlerParams,
    data?: TooltipData
  ) => {
    if (this._isReleased) {
      return TooltipResult.failed;
    }

    if (!visible) {
      this._clearAllCache();
      /** 关闭 tooltip */
      this._updateTooltip(false, params);
      return TooltipResult.success;
    }

    return this._changeTooltipPosition(params, data);
  };

  /** 改变 tooltip 位置（带 throttle 版本），返回是否遇到异常 */
  protected changeTooltipPosition: ChangeTooltipPositionFunc;

  /** 改变 tooltip 位置（不带 throttle 版本），返回是否遇到异常 */
  protected _changeTooltipPosition: ChangeTooltipPositionFunc = (params: TooltipHandlerParams, data: TooltipData) => {
    if (this._isReleased) {
      return TooltipResult.failed;
    }

    const event = params.event as MouseEvent;
    const { tooltipSpec, tooltipActual, changePositionOnly } = params;

    if (tooltipSpec.enterable) {
      if (!this._isPointerEscaped && this._isPointerMovingToTooltip(params)) {
        if (!this._isTooltipPaused) {
          this._isTooltipPaused = true;
          this._cachePointerTimer = setTimeout(() => {
            this._isPointerEscaped = true;
          }, 300) as unknown as number;
        }
        return TooltipResult.success;
      }
      this._isTooltipPaused = false;
      this._isPointerEscaped = false;
      clearTimeout(this._cachePointerTimer);
      this._cachePointerPosition = this._getPointerPositionRelativeToTooltipParent(params);
    }

    const activeType = tooltipActual.activeType;

    /** 用户自定义逻辑 */
    if (tooltipSpec.handler) {
      return tooltipSpec.handler.showTooltip?.(activeType, data, params) ?? TooltipResult.success;
    }

    /** 默认逻辑 */
    const pattern = tooltipSpec[activeType];
    if (!pattern) {
      return TooltipResult.failed;
    }

    // 计算 tooltip 位置
    const position = this._getActualTooltipPosition(
      tooltipActual,
      params,
      this._getTooltipBoxSize(tooltipActual, changePositionOnly)
    );
    tooltipActual.position = position;
    if (pattern.updatePosition) {
      tooltipActual.position = pattern.updatePosition(tooltipActual.position, data, params);
    }

    // 判断 tooltip 可见性
    let tooltipVisible = pattern?.visible !== false;
    if (
      !data ||
      event.type === 'pointerout' ||
      !tooltipActual.visible ||
      (!tooltipActual.title && !tooltipActual.content)
    ) {
      tooltipVisible = false;
    }

    this._updateTooltip(tooltipVisible, {
      ...params,
      changePositionOnly
    });
    return TooltipResult.success;
  };

  hideTooltip(params: TooltipHandlerParams): TooltipResult {
    return this.changeTooltip(false, params);
  }

  release(): void {
    this._clearAllCache();
    const spec = this._component.getSpec() ?? {};
    /** 用户自定义逻辑 */
    if (spec.handler) {
      spec.handler.release?.();
      return;
    }
    /** 默认逻辑 */
    this._removeTooltip();

    this._isReleased = true;
  }

  protected _clearAllCache() {
    this._isTooltipPaused = false;
    this._isPointerEscaped = false;
    clearTimeout(this._cachePointerTimer);
    this._cachePointerTimer = -1;
    this._cachePointerPosition = undefined;
    this._cacheTooltipPosition = undefined;
    this._cacheTooltipSize = undefined;
  }

  /* -----需要子类继承的方法开始----- */

  protected abstract _updateTooltip(visible: boolean, params: TooltipHandlerParams): void;
  protected abstract _removeTooltip(): void;

  /* -----需要子类继承的方法结束----- */

  protected _throttle(callback: any) {
    const tooltipSpec = this._component.getSpec();
    let wait: number;
    if (isNumber(tooltipSpec.throttleInterval)) {
      wait = tooltipSpec.throttleInterval;
    } else {
      if (tooltipSpec.renderMode !== 'html' || !tooltipSpec.transitionDuration) {
        wait = 10;
      } else {
        wait = 50;
      }
    }
    return throttle(callback, wait);
  }

  protected _getDefaultOption(): Options {
    const { offset } = this._component.getSpec();
    return {
      ...DEFAULT_OPTIONS,
      offsetX: offset?.x ?? DEFAULT_OPTIONS.offsetX,
      offsetY: offset?.y ?? DEFAULT_OPTIONS.offsetY
    };
  }

  /**
   * 计算实际的 tooltip 位置
   */
  protected _getActualTooltipPosition = (
    actualTooltip: ITooltipActual,
    params: TooltipHandlerParams,
    tooltipBoxSize: IContainerSize | undefined
  ): ITooltipPositionActual => {
    const event = params.event as MouseEvent;
    const { tooltipSpec } = params;
    const firstDimensionInfo = params.dimensionInfo?.[0];

    const invalidPosition = {
      x: Infinity,
      y: Infinity
    };

    let { offsetX, offsetY } = this._option;
    if (!tooltipSpec) {
      this._cacheTooltipPosition = undefined;
      return invalidPosition;
    }

    const { activeType, data } = actualTooltip;
    const pattern = tooltipSpec[activeType];
    const position = getTooltipPatternValue(pattern.position, data, params);
    const positionMode =
      getTooltipPatternValue(pattern.positionMode, data, params) ?? (activeType === 'mark' ? 'mark' : 'pointer');
    const tooltipParentElement = this._getParentElement(tooltipSpec);
    const { width: tooltipBoxWidth = 0, height: tooltipBoxHeight = 0 } = tooltipBoxSize ?? {};

    const isCanvas = tooltipSpec.renderMode === 'canvas';
    const canvasRect = params?.chart?.getCanvasRect();
    const canvasWidth = canvasRect?.width ?? DEFAULT_CHART_WIDTH;
    const canvasHeight = canvasRect?.height ?? DEFAULT_CHART_HEIGHT;
    let isFixedPosition = false;

    const containerSize = {
      width: 0,
      height: 0
    };
    let relativePosOffset = { x: 0, y: 0 };
    let tooltipParentElementRect: IPoint | DOMRect = { x: 0, y: 0 };
    let chartElementScale = 1;
    let tooltipParentElementScale = 1;

    if (isTrueBrowser(this._env) && !tooltipSpec.confine) {
      // 只有在 browser 模式下才可以获取到 window 对象
      containerSize.width = window.innerWidth;
      containerSize.height = window.innerHeight;

      if (!isCanvas) {
        tooltipParentElementRect = tooltipParentElement?.getBoundingClientRect?.() ?? invalidPosition;
        const chartElement = (this._compiler.getCanvas() ?? this._chartContainer) as HTMLElement;
        const chartElementRect = chartElement?.getBoundingClientRect();
        relativePosOffset = {
          x: chartElementRect.x - tooltipParentElementRect.x,
          y: chartElementRect.y - tooltipParentElementRect.y
        };
        chartElementScale = getScale(chartElement, chartElementRect);
        tooltipParentElementScale = getScale(tooltipParentElement, tooltipParentElementRect as DOMRect);
      }
    } else {
      containerSize.width = canvasWidth;
      containerSize.height = canvasHeight;
    }
    const tooltipSizeScale = tooltipParentElementScale / chartElementScale;

    /* 一、计算 left、top、right、bottom */
    let left: number | undefined;
    let top: number | undefined;
    let right: number | undefined;
    let bottom: number | undefined;

    let pointerFixedPositionX: TooltipFixedPosition = position as any;
    let pointerFixedPositionY: TooltipFixedPosition = position as any;

    const processCartesianFixedPositionX = ({ orient, mode, offset }: ITooltipPositionFixedValue) => {
      let x1: number;
      let x2: number;
      const model = params.model as ILayoutModel;
      const startPoint = model?.getLayoutStartPoint();
      offsetX = offset ?? offsetX;

      if (mode === 'mark') {
        isFixedPosition = true;
        const element = params.item as IElement;
        const bounds = element?.getBounds() as AABBBounds;
        if (bounds && startPoint) {
          x1 = bounds.x1 + startPoint.x;
          x2 = bounds.x2 + startPoint.x;
        }
      } else if (mode === 'crosshair' && firstDimensionInfo?.axis?.getCoordinateType() === 'cartesian') {
        isFixedPosition = true;
        const rect = getCartesianCrosshairRect(
          params.dimensionInfo,
          getFirstSeries(this._component.getRegions(), 'cartesian') as ICartesianSeries,
          startPoint
        );
        if (rect) {
          x1 = rect.start.x;
          x2 = rect.end.x;
        }
      } else {
        pointerFixedPositionX = orient;
      }

      if (isFixedPosition) {
        switch (getHorizontalPositionType(orient)) {
          case 'left':
            left = x1 - tooltipBoxWidth * tooltipSizeScale - offsetX;
            break;
          case 'right':
            left = x2 + offsetX;
            break;
          case 'center':
            left = (x1 + x2) / 2 - (tooltipBoxWidth * tooltipSizeScale) / 2;
            break;
          case 'centerLeft':
            left = (x1 + x2) / 2 - tooltipBoxWidth * tooltipSizeScale - offsetX;
            break;
          case 'centerRight':
            left = (x1 + x2) / 2 + offsetX;
            break;
        }
      }
    };
    const processCartesianFixedPositionY = ({ orient, mode, offset }: ITooltipPositionFixedValue) => {
      let y1: number;
      let y2: number;
      const model = params.model as ILayoutModel;
      const startPoint = model?.getLayoutStartPoint();
      offsetY = offset ?? offsetY;

      if (mode === 'mark') {
        isFixedPosition = true;
        const element = params.item as IElement;
        const bounds = element?.getBounds() as AABBBounds;
        if (bounds && startPoint) {
          y1 = bounds.y1 + startPoint.y;
          y2 = bounds.y2 + startPoint.y;
        }
      } else if (mode === 'crosshair' && firstDimensionInfo?.axis?.getCoordinateType() === 'cartesian') {
        isFixedPosition = true;
        const rect = getCartesianCrosshairRect(
          params.dimensionInfo,
          getFirstSeries(this._component.getRegions(), 'cartesian') as ICartesianSeries,
          startPoint
        );
        if (rect) {
          y1 = rect.start.y;
          y2 = rect.end.y;
        }
      } else {
        pointerFixedPositionY = orient;
      }

      if (isFixedPosition) {
        switch (getVerticalPositionType(orient)) {
          case 'top':
            top = y1 - tooltipBoxHeight * tooltipSizeScale - offsetY;
            break;
          case 'bottom':
            top = y2 + offsetY;
            break;
          case 'center':
            top = (y1 + y2) / 2 - (tooltipBoxHeight * tooltipSizeScale) / 2;
            break;
          case 'centerTop':
            top = (y1 + y2) / 2 - tooltipBoxHeight * tooltipSizeScale - offsetY;
            break;
          case 'centerBottom':
            top = (y1 + y2) / 2 + offsetY;
            break;
        }
      }
    };

    if (isObject(position)) {
      if (isGlobalTooltipPositionPattern(position)) {
        const {
          left: posLeft,
          right: posRight,
          top: posTop,
          bottom: posBottom
        } = position as IGlobalTooltipPositionPattern;
        left = getActualTooltipPositionValue(posLeft, event);
        top = getActualTooltipPositionValue(posTop, event);
        right = getActualTooltipPositionValue(posRight, event);
        bottom = getActualTooltipPositionValue(posBottom, event);
      } else if (isFixedTooltipPositionPattern(position)) {
        const { x, y } = position;
        if (isNumber(x) || isFunction(x)) {
          left = getActualTooltipPositionValue(x, event);
        } else {
          processCartesianFixedPositionX(x);
        }
        if (isNumber(y) || isFunction(y)) {
          top = getActualTooltipPositionValue(y, event);
        } else {
          processCartesianFixedPositionY(y);
        }
      }
    } else if (isValid(position)) {
      processCartesianFixedPositionX({ orient: position, mode: positionMode });
      processCartesianFixedPositionY({ orient: position, mode: positionMode });
    }

    /* 二、换算成 x 和 y */
    let x: number;
    let y: number;

    const { canvasX, canvasY } = event as any;
    if (isValidNumber(left)) {
      x = left;
    } else if (isValidNumber(right)) {
      x = canvasWidth - tooltipBoxWidth * tooltipSizeScale - right;
    } else {
      const x0 = canvasX;
      switch (getHorizontalPositionType(pointerFixedPositionX, 'right')) {
        case 'center':
          x = x0 - (tooltipBoxWidth * tooltipSizeScale) / 2;
          break;
        case 'left':
        case 'centerLeft':
          x = x0 - tooltipBoxWidth * tooltipSizeScale - offsetX;
          break;
        case 'right':
        case 'centerRight':
          x = x0 + offsetX;
          break;
      }
    }
    if (isValidNumber(top)) {
      y = top;
    } else if (isValidNumber(bottom)) {
      y = canvasHeight - tooltipBoxHeight * tooltipSizeScale - bottom;
    } else {
      const y0 = canvasY;
      switch (getVerticalPositionType(pointerFixedPositionY, 'bottom')) {
        case 'center':
          y = y0 - (tooltipBoxHeight * tooltipSizeScale) / 2;
          break;
        case 'top':
        case 'centerTop':
          y = y0 - tooltipBoxHeight * tooltipSizeScale - offsetY;
          break;
        case 'bottom':
        case 'centerBottom':
          y = y0 + offsetY;
          break;
      }
    }

    x *= chartElementScale;
    y *= chartElementScale;
    if (isTrueBrowser(this._env)) {
      x += relativePosOffset.x;
      y += relativePosOffset.y;
    }
    x /= tooltipParentElementScale;
    y /= tooltipParentElementScale;

    /* 三、确保tooltip在视区内 */
    const { width: containerWidth, height: containerHeight } = containerSize;

    const isLeftOut = () => x * tooltipParentElementScale + tooltipParentElementRect.x < 0;
    const isRightOut = () =>
      (x + tooltipBoxWidth) * tooltipParentElementScale + tooltipParentElementRect.x > containerWidth;
    const isTopOut = () => y * tooltipParentElementScale + tooltipParentElementRect.y < 0;
    const isBottomOut = () =>
      (y + tooltipBoxHeight) * tooltipParentElementScale + tooltipParentElementRect.y > containerHeight;

    const detectLeftFirst = () => {
      if (isLeftOut()) {
        // 位置不超出视区左界
        if (isFixedPosition) {
          x = -tooltipParentElementRect.x / tooltipParentElementScale;
        } else {
          if (getHorizontalPositionType(position as TooltipFixedPosition, 'right') === 'center') {
            x += offsetX + tooltipBoxWidth / 2;
          } else {
            x += offsetX * 2 + tooltipBoxWidth;
          }
        }
      }
    };
    const detectLeftLast = () => {
      if (isLeftOut()) {
        // 位置不超出视区左界
        x = -tooltipParentElementRect.x / tooltipParentElementScale;
      }
    };
    const detectRightFirst = () => {
      if (isRightOut()) {
        // 位置不超出视区右界
        if (isFixedPosition) {
          x = (containerWidth - tooltipParentElementRect.x) / tooltipParentElementScale - tooltipBoxWidth;
        } else {
          if (getHorizontalPositionType(position as TooltipFixedPosition, 'right') === 'center') {
            x -= offsetX + tooltipBoxWidth / 2;
          } else {
            x -= offsetX * 2 + tooltipBoxWidth;
          }
        }
      }
    };
    const detectRightLast = () => {
      if (isRightOut()) {
        // 位置不超出视区右界
        x = (containerWidth - tooltipParentElementRect.x) / tooltipParentElementScale - tooltipBoxWidth;
      }
    };
    const detectTopFirst = () => {
      if (isTopOut()) {
        // 位置不超出视区上界
        if (isFixedPosition) {
          y = -tooltipParentElementRect.y / tooltipParentElementScale;
        } else {
          if (getVerticalPositionType(position as TooltipFixedPosition, 'bottom') === 'center') {
            y += offsetY + tooltipBoxHeight / 2;
          } else {
            y += offsetY * 2 + tooltipBoxHeight;
          }
        }
      }
    };
    const detectTopLast = () => {
      if (isTopOut()) {
        // 位置不超出视区上界
        y = 0 - tooltipParentElementRect.y / tooltipParentElementScale;
      }
    };
    const detectBottomFirst = () => {
      if (isBottomOut()) {
        // 位置不超出视区下界
        if (isFixedPosition) {
          y = (containerHeight - tooltipParentElementRect.y) / tooltipParentElementScale - tooltipBoxHeight;
        } else {
          if (getVerticalPositionType(position as TooltipFixedPosition, 'bottom') === 'center') {
            y -= offsetY + tooltipBoxHeight / 2;
          } else {
            y -= offsetY * 2 + tooltipBoxHeight;
          }
        }
      }
    };
    const detectBottomLast = () => {
      if (isBottomOut()) {
        // 位置不超出视区下界
        y = (containerHeight - tooltipParentElementRect.y) / tooltipParentElementScale - tooltipBoxHeight;
      }
    };

    // 处理左右
    switch (getHorizontalPositionType(position as TooltipFixedPosition, 'right')) {
      case 'center':
      case 'centerLeft':
      case 'centerRight':
        if (isLeftOut()) {
          detectLeftFirst();
          detectRightLast();
        } else {
          detectRightFirst();
          detectLeftLast();
        }
        break;
      case 'left':
        detectLeftFirst();
        detectRightLast();
        break;
      case 'right':
        detectRightFirst();
        detectLeftLast();
        break;
    }
    // 处理上下
    switch (getVerticalPositionType(position as TooltipFixedPosition, 'bottom')) {
      case 'center':
      case 'centerTop':
      case 'centerBottom':
        if (isTopOut()) {
          detectTopFirst();
          detectBottomLast();
        } else {
          detectBottomFirst();
          detectTopLast();
        }
        break;
      case 'top':
        detectTopFirst();
        detectBottomLast();
        break;
      case 'bottom':
        detectBottomFirst();
        detectTopLast();
        break;
    }

    const result = { x, y };
    this._cacheTooltipPosition = result;
    this._cacheTooltipSize = { width: tooltipBoxWidth, height: tooltipBoxHeight };
    return result;
  };

  // 计算 tooltip 内容区域的宽高，并缓存结果
  protected _getTooltipBoxSize(actualTooltip: ITooltipActual, changePositionOnly: boolean): IContainerSize | undefined {
    if (!changePositionOnly || isNil(this._attributes)) {
      const chartTheme = this._chartOption?.getTheme() ?? {};
      this._attributes = getTooltipAttributes(actualTooltip, this._component.getSpec(), chartTheme);
    }
    const { panel, panelDomHeight } = this._attributes ?? {};
    // canvas模式下, size需要考虑border size, 目的是为了精准判断边界是否超出画布，达到confine效果
    // html模式不提供confine, 所以不考虑精准计算size
    const isCanvas = this._component.getSpec().renderMode === 'canvas';

    return {
      width: panel?.width + (isCanvas ? panel.lineWidth : 0),
      height: (panelDomHeight ?? panel?.height) + (isCanvas ? panel.lineWidth : 0)
    };
  }

  protected _getPointerPositionRelativeToTooltipParent(params: TooltipHandlerParams) {
    let { canvasX: x, canvasY: y } = params.event;
    const { tooltipSpec } = params;

    const invalidPosition = {
      x: Infinity,
      y: Infinity
    };

    const isCanvas = tooltipSpec.renderMode === 'canvas';
    const tooltipParentElement = this._getParentElement(tooltipSpec);

    let relativePosOffset = { x: 0, y: 0 };
    let tooltipParentElementRect: IPoint | DOMRect = { x: 0, y: 0 };
    let chartElementScale = 1;
    let tooltipParentElementScale = 1;

    if (isTrueBrowser(this._env) && !tooltipSpec.confine) {
      if (!isCanvas) {
        tooltipParentElementRect = tooltipParentElement?.getBoundingClientRect() ?? invalidPosition;
        const chartElement = (this._compiler.getCanvas() ?? this._chartContainer) as HTMLElement;
        const chartElementRect = chartElement?.getBoundingClientRect();
        relativePosOffset = {
          x: chartElementRect.x - tooltipParentElementRect.x,
          y: chartElementRect.y - tooltipParentElementRect.y
        };
        chartElementScale = getScale(chartElement, chartElementRect);
        tooltipParentElementScale = getScale(tooltipParentElement, tooltipParentElementRect as DOMRect);
      }
    }

    x *= chartElementScale;
    y *= chartElementScale;
    if (isTrueBrowser(this._env)) {
      x += relativePosOffset.x;
      y += relativePosOffset.y;
    }
    x /= tooltipParentElementScale;
    y /= tooltipParentElementScale;
    return { x, y };
  }

  protected _isPointerMovingToTooltip(params: TooltipHandlerParams) {
    if (!this._cacheTooltipPosition || !this._cacheTooltipSize || !this._cachePointerPosition) {
      return false;
    }
    const { width: tooltipWidth, height: tooltipHeight } = this._cacheTooltipSize;
    const { x: tooltipX = 0, y: tooltipY } = this._cacheTooltipPosition;

    const pos = this._getPointerPositionRelativeToTooltipParent(params);

    if (
      pointInRect(
        pos,
        {
          x1: tooltipX,
          y1: tooltipY,
          x2: tooltipX + tooltipWidth,
          y2: tooltipY + tooltipHeight
        },
        false
      )
    ) {
      return true;
    }

    // 确定 tooltip 四端点坐标
    const a = { x: tooltipX, y: tooltipY };
    const b = { x: a.x + tooltipWidth, y: a.y };
    const c = { x: a.x, y: a.y + tooltipHeight };
    const d = { x: b.x, y: c.y };
    const oldPos = this._cachePointerPosition;

    return (
      polygonContainPoint([oldPos, a, b], pos.x, pos.y) ||
      polygonContainPoint([oldPos, c, d], pos.x, pos.y) ||
      polygonContainPoint([oldPos, a, d], pos.x, pos.y) ||
      polygonContainPoint([oldPos, b, c], pos.x, pos.y)
    );
  }

  protected _getParentElement(spec: ITooltipSpec): HTMLElement {
    return spec.parentElement as any;
  }

  getTooltipContainer() {
    return this._container;
  }

  protected _initFromSpec() {
    this._option = this._getDefaultOption();
    // 为方法加防抖
    this.changeTooltip = this._throttle(this._changeTooltip) as any;
    this.changeTooltipPosition = this._throttle(this._changeTooltipPosition) as any;
  }

  reInit() {
    this._initFromSpec();
  }
}
