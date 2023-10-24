import { DEFAULT_CHART_WIDTH, DEFAULT_CHART_HEIGHT } from '../../../constant/base';
import type { Options } from './constants';
// eslint-disable-next-line no-duplicate-imports
import { DEFAULT_OPTIONS } from './constants';
import type { Maybe, IPoint } from '../../../typings';
// eslint-disable-next-line no-duplicate-imports
import { TooltipPositionMode } from '../../../typings';
// eslint-disable-next-line no-duplicate-imports
import { isTrueBrowser, isValid, throttle, isNil } from '../../../util';
import type {
  TooltipData,
  IToolTipActual,
  TooltipActiveType,
  ITooltipHandler,
  ITooltipPattern,
  ITooltipPositionActual,
  TooltipPosition,
  ITooltipPositionPattern
} from '../../../typings/tooltip';
// eslint-disable-next-line no-duplicate-imports
import type { TooltipFixedPosition } from '../../../typings/tooltip';
import type { BaseEventParams } from '../../../event/interface';
import {
  getShowContent,
  getTooltipSpecForShow,
  getActualTooltipPositionValue,
  getTooltipPatternValue,
  getScale,
  getHorizontalPositionType,
  getVerticalPositionType
} from './utils';
import type { Tooltip, TooltipActualTitleContent } from '../tooltip';
import type { ISeries } from '../../../series/interface';
import type { ITooltipSpec, TooltipHandlerParams } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { TooltipResult } from '../interface';
import type { IGroup } from '@visactor/vrender-core';
import type { AABBBounds } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isNumber, isObject, isValidNumber } from '@visactor/vutils';
import type { IElement } from '@visactor/vgrammar-core';
import type { IModel } from '../../../model/interface';
import type { Compiler } from '../../../compile/compiler';
import type { IContainerSize, TooltipAttributes } from '@visactor/vrender-components';
import { getTooltipAttributes } from './utils/attribute';
import type { DimensionEventParams } from '../../../event/events/dimension/interface';
import type { IChartOption } from '../../../chart/interface';
import type { IChartLevelTheme } from '../../../core/interface';
import { defaultChartLevelTheme } from '../../../theme';

type ChangeTooltipFunc = (
  visible: boolean,
  params: TooltipHandlerParams,
  changePositionOnly?: boolean,
  activeType?: TooltipActiveType,
  data?: TooltipData
) => TooltipResult;

type ChangeTooltipPositionFunc = (
  changePositionOnly: boolean,
  actualTooltip: IToolTipActual,
  spec: ITooltipSpec,
  activeType: TooltipActiveType,
  data: TooltipData,
  params: TooltipHandlerParams
) => TooltipResult;

/**
 * The tooltip handler class.
 */
export abstract class BaseTooltipHandler implements ITooltipHandler {
  readonly type: string;

  /** 是否可见 */
  protected _visible = true;

  // protected _style: ITooltipStyle = {};

  protected _option: Options;

  protected _chartOption: IChartOption;

  protected _id = '';
  public get id() {
    return this._id;
  }

  protected _env;
  public get env() {
    return this._env;
  }

  protected _component: Tooltip;
  protected _attributes?: TooltipAttributes | null = null;

  protected _chartContainer: Maybe<HTMLElement>;
  protected _compiler: Compiler;

  private _cacheViewSpec: ITooltipSpec | undefined;
  private _cacheActualTooltip: IToolTipActual | undefined;

  // tooltip 容器
  protected _container!: Maybe<IGroup | HTMLElement>;

  protected _isReleased: boolean = false;

  /**
   * Create the tooltip handler.
   */
  constructor(tooltipId: string, component: Tooltip) {
    this._component = component;
    this._chartOption = component.getOption() as any;
    this._env = this._chartOption.mode;
    this._chartContainer = this._chartOption.globalInstance.getContainer();
    this._compiler = component.getCompiler();
    this._id = tooltipId; // 可能有多个 tooltip
    this._initFromSpec();
  }

  showTooltip = (activeType: TooltipActiveType, data: TooltipData, params: TooltipHandlerParams) => {
    let changePositionOnly = !!params.changePositionOnly;
    if (!params.changePositionOnly || this._cacheActualTooltip?.activeType !== activeType) {
      changePositionOnly = false;
      this._cacheViewSpec = undefined;
      this._cacheActualTooltip = undefined;
    }

    if (changePositionOnly && this._cacheViewSpec && this._cacheActualTooltip) {
      return this.changeTooltipPosition(
        changePositionOnly,
        this._cacheActualTooltip,
        this._cacheViewSpec,
        activeType,
        data,
        params
      );
    }
    return this.changeTooltip(true, params, changePositionOnly, activeType, data);
  };

  /** 改变 tooltip 内容和位置（带 throttle 版本），返回是否遇到异常 */
  protected changeTooltip: ChangeTooltipFunc;

  /** 改变 tooltip 内容和位置（不带 throttle 版本），返回是否遇到异常 */
  protected _changeTooltip: ChangeTooltipFunc = (
    visible: boolean,
    params: TooltipHandlerParams,
    changePositionOnly?: boolean,
    activeType?: TooltipActiveType,
    data?: TooltipData
  ) => {
    const tooltipSpec = this._component.getSpec() as ITooltipSpec;
    if (this._isReleased || !tooltipSpec) {
      return TooltipResult.failed;
    }

    /** 关闭 tooltip */
    if (!visible) {
      this._cacheViewSpec = undefined;
      this._cacheActualTooltip = undefined;

      /** 用户自定义逻辑 */
      if (tooltipSpec.handler) {
        return tooltipSpec.handler.hideTooltip?.(params) ?? TooltipResult.success;
      }
      /** 默认逻辑 */
      this._updateTooltip(false, params);
      return TooltipResult.success;
    }

    if (isNil(activeType) || isNil(data)) {
      return TooltipResult.failed;
    }

    /** spec 预处理 */
    let spec: ITooltipSpec | undefined;
    if (changePositionOnly && this._cacheViewSpec) {
      spec = this._cacheViewSpec;
    } else {
      spec = getTooltipSpecForShow(
        activeType!,
        tooltipSpec,
        (params as BaseEventParams).model as ISeries,
        (params as DimensionEventParams).dimensionInfo
      );
      this._cacheViewSpec = spec;
    }

    if (spec.visible === false) {
      return TooltipResult.failed;
    }

    /** 用户自定义逻辑 */
    if (spec.handler) {
      return spec.handler.showTooltip?.(activeType!, data!, params) ?? TooltipResult.success;
    }

    /** 默认逻辑 */
    const pattern = spec[activeType!] as ITooltipPattern;
    if (!pattern) {
      return TooltipResult.failed;
    }

    // 合成 tooltip 内容
    let actualTooltip: IToolTipActual | undefined;
    if (changePositionOnly && this._cacheActualTooltip) {
      actualTooltip = this._cacheActualTooltip;
    } else {
      actualTooltip = this._getActualTooltipContent(pattern, data!, params);
      actualTooltip.title = pattern.updateTitle?.(actualTooltip.title, data, params) ?? actualTooltip.title;
      actualTooltip.content = pattern.updateContent?.(actualTooltip.content, data, params) ?? actualTooltip.content;
    }

    // 判断 tooltip 是否为空
    if (isNil(actualTooltip.title?.key) && isNil(actualTooltip.title?.value) && !actualTooltip.content?.length) {
      return TooltipResult.failed;
    }

    this._cacheActualTooltip = actualTooltip;
    return this._changeTooltipPosition(!!changePositionOnly, actualTooltip, spec, activeType!, data!, params);
  };

  /** 改变 tooltip 位置（带 throttle 版本），返回是否遇到异常 */
  protected changeTooltipPosition: ChangeTooltipPositionFunc;

  /** 改变 tooltip 位置（不带 throttle 版本），返回是否遇到异常 */
  protected _changeTooltipPosition: ChangeTooltipPositionFunc = (
    changePositionOnly: boolean,
    actualTooltip: IToolTipActual,
    spec: ITooltipSpec,
    activeType: TooltipActiveType,
    data: TooltipData,
    params: TooltipHandlerParams
  ) => {
    if (this._isReleased) {
      return TooltipResult.failed;
    }

    const event = params.event as MouseEvent;

    /** 用户自定义逻辑 */
    if (spec.handler) {
      return spec.handler.showTooltip?.(activeType, data, params) ?? TooltipResult.success;
    }

    /** 默认逻辑 */
    const pattern = spec[activeType];
    if (!pattern) {
      return TooltipResult.failed;
    }

    // 计算 tooltip 位置
    const position = this._getActualTooltipPosition(
      actualTooltip,
      getTooltipPatternValue(pattern.position, data, params),
      getTooltipPatternValue(pattern.positionMode, data, params),
      params,
      this._getParentElement(spec),
      changePositionOnly
    );
    actualTooltip.position = position;
    if (pattern.updatePosition) {
      actualTooltip.position = pattern.updatePosition(actualTooltip.position, data, params);
    }

    // 判断 tooltip 可见性
    let tooltipVisible = pattern?.visible !== false;
    if (
      !data ||
      event.type === 'pointerout' ||
      !actualTooltip.visible ||
      (!actualTooltip.title && !actualTooltip.content)
    ) {
      tooltipVisible = false;
    }

    this._updateTooltip(
      tooltipVisible,
      {
        ...params,
        changePositionOnly
      },
      actualTooltip
    );
    return TooltipResult.success;
  };

  hideTooltip(params: TooltipHandlerParams): TooltipResult {
    return this.changeTooltip(false, params);
  }

  release(): void {
    this._cacheViewSpec = undefined;
    this._cacheActualTooltip = undefined;

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

  /* -----需要子类继承的方法开始----- */

  protected abstract _updateTooltip(visible: boolean, params: TooltipHandlerParams, domData?: IToolTipActual): void;
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
   * 计算实际的 tooltip 内容
   * @param pattern
   * @param data
   * @param event
   */
  protected _getActualTooltipContent = (
    pattern: ITooltipPattern,
    data: TooltipData,
    params: TooltipHandlerParams
  ): IToolTipActual => {
    // 可见性
    const patternVisible = getTooltipPatternValue(pattern.visible, data, params);

    // 数据
    let tooltipContent: TooltipActualTitleContent | null = null;
    tooltipContent = getShowContent(pattern, data, params);

    const actualTooltip: IToolTipActual = {
      ...tooltipContent,
      visible: isValid(tooltipContent) ? patternVisible !== false : false, // 最终展示数据为 null 则不展示
      activeType: pattern.activeType
    };

    return actualTooltip;
  };

  /**
   * 计算实际的 tooltip 位置
   * @param actualTooltip
   * @param position
   * @param event
   * @returns
   */
  protected _getActualTooltipPosition = (
    actualTooltip: IToolTipActual,
    position: TooltipPosition | undefined,
    positionMode: TooltipPositionMode | undefined,
    params: TooltipHandlerParams,
    tooltipParentElement: HTMLElement,
    changePositionOnly: boolean
  ): ITooltipPositionActual => {
    const event = params.event as MouseEvent;
    const { width: tooltipBoxWidth = 0, height: tooltipBoxHeight = 0 } =
      this._getTooltipBoxSize(actualTooltip, changePositionOnly) ?? {};

    const invalidPosition = {
      x: Infinity,
      y: Infinity
    };

    const { offsetX, offsetY } = this._option;
    const tooltipSpec = this._component.getSpec();
    if (!tooltipSpec) {
      return invalidPosition;
    }

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
    if (isObject(position)) {
      const { left: posLeft, right: posRight, top: posTop, bottom: posBottom } = position as ITooltipPositionPattern;
      left = getActualTooltipPositionValue(posLeft, event);
      top = getActualTooltipPositionValue(posTop, event);
      right = getActualTooltipPositionValue(posRight, event);
      bottom = getActualTooltipPositionValue(posBottom, event);
    } else if (
      isValid(position) &&
      positionMode !== TooltipPositionMode.pointer &&
      actualTooltip.activeType === 'mark'
    ) {
      isFixedPosition = true;
      const element = params.item as IElement;
      const model = params.model as IModel;
      const bounds = element?.getBounds() as AABBBounds;
      const startPoint = model?.getLayoutStartPoint();
      if (bounds && startPoint) {
        let { x1, y1, x2, y2 } = bounds;
        x1 += startPoint.x;
        x2 += startPoint.x;
        y1 += startPoint.y;
        y2 += startPoint.y;
        switch (getHorizontalPositionType(position)) {
          case 'left':
            left = x1 - tooltipBoxWidth * tooltipSizeScale - offsetX;
            break;
          case 'right':
            left = x2 + offsetX;
            break;
          case 'middle':
            left = (x1 + x2) / 2 - (tooltipBoxWidth * tooltipSizeScale) / 2;
            break;
        }
        switch (getVerticalPositionType(position)) {
          case 'top':
            top = y1 - tooltipBoxHeight * tooltipSizeScale - offsetY;
            break;
          case 'bottom':
            top = y2 + offsetY;
            break;
          case 'middle':
            top = (y1 + y2) / 2 - (tooltipBoxHeight * tooltipSizeScale) / 2;
            break;
        }
      }
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
      switch (getHorizontalPositionType(position as TooltipFixedPosition, 'right')) {
        case 'middle':
          x = x0 - (tooltipBoxWidth * tooltipSizeScale) / 2;
          break;
        case 'left':
          x = x0 - tooltipBoxWidth * tooltipSizeScale - offsetX;
          break;
        case 'right':
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
      switch (getVerticalPositionType(position as TooltipFixedPosition, 'bottom')) {
        case 'middle':
          y = y0 - (tooltipBoxHeight * tooltipSizeScale) / 2;
          break;
        case 'top':
          y = y0 - tooltipBoxHeight * tooltipSizeScale - offsetY;
          break;
        case 'bottom':
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
          if (getHorizontalPositionType(position as TooltipFixedPosition, 'right') === 'middle') {
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
          if (getHorizontalPositionType(position as TooltipFixedPosition, 'right') === 'middle') {
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
          if (getVerticalPositionType(position as TooltipFixedPosition, 'bottom') === 'middle') {
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
          if (getVerticalPositionType(position as TooltipFixedPosition, 'bottom') === 'middle') {
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
      case 'middle':
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
      case 'middle':
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

    return { x, y };
  };

  // 计算 tooltip 内容区域的宽高，并缓存结果
  protected _getTooltipBoxSize(actualTooltip: IToolTipActual, changePositionOnly: boolean): IContainerSize | undefined {
    if (!changePositionOnly || isNil(this._attributes)) {
      const { chartLevelTheme = defaultChartLevelTheme } = this._chartOption.getThemeConfig?.() ?? {};
      this._attributes = getTooltipAttributes(
        actualTooltip,
        this._component.getSpec(),
        chartLevelTheme as IChartLevelTheme
      );
    }
    return {
      width: this._attributes?.panel?.width,
      height: this._attributes?.panel?.height
    };
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
