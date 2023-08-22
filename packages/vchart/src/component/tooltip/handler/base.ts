import { DEFAULT_CHART_WIDTH, DEFAULT_CHART_HEIGHT } from '../../../constant/base';
import type { Options } from './constants';
// eslint-disable-next-line no-duplicate-imports
import { DEFAULT_OPTIONS } from './constants';
import type { Maybe, IPoint } from '../../../typings';
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
import { TooltipFixedPosition } from '../../../typings/tooltip';
import type { BaseEventParams } from '../../../event/interface';
import {
  getShowContent,
  getTooltipSpecForShow,
  getActualTooltipPositionValue,
  getTooltipPatternValue,
  getScale
} from './utils';
import type { Tooltip, TooltipContent } from '../tooltip';
import type { ISeries } from '../../../series/interface';
import type { ITooltipSpec, TooltipHandlerParams } from '../interface';
// eslint-disable-next-line no-duplicate-imports
import { TooltipResult } from '../interface';
import type { ITooltipPanelStyle, ITooltipStyle } from './interface';
import type { IGroup } from '@visactor/vrender';
import { getTextAttributes } from './utils/style';
import type { AABBBounds } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isNumber, isObject, isValidNumber } from '@visactor/vutils';
import type { IElement } from '@visactor/vgrammar';
import type { IModel } from '../../../model/interface';
import type { Compiler } from '../../../compile/compiler';
import type { IContainerSize, TooltipAttributes } from '@visactor/vrender-components';
import { getTooltipAttributes } from './utils/attribute';
import type { DimensionEventParams } from '../../../event/events/dimension/interface';
import type { IChartOption } from '../../../chart/interface';

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

  protected _chartContainer: Maybe<HTMLElement>;
  protected _compiler: Compiler;

  private _cacheViewSpec: ITooltipSpec | undefined;
  private _cacheActualTooltip: IToolTipActual | undefined;

  protected _attributeCache?: TooltipAttributes | null = null;

  protected _style: ITooltipStyle;

  // tooltip 容器
  protected _container!: Maybe<IGroup | HTMLElement>;

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
    /** 关闭tooltip */
    if (!visible) {
      this._cacheViewSpec = undefined;
      this._cacheActualTooltip = undefined;

      const spec = this._component.getSpec() as ITooltipSpec;
      /** 用户自定义逻辑 */
      if (spec.handler) {
        return spec.handler.hideTooltip?.(params) ?? TooltipResult.success;
      }
      /** 默认逻辑 */
      this._updateTooltip(false, params);
      return TooltipResult.success;
    }

    if (isNil(activeType) || isNil(data)) {
      return TooltipResult.failed;
    }

    /** spec预处理 */
    let spec: ITooltipSpec | undefined;
    if (changePositionOnly && this._cacheViewSpec) {
      spec = this._cacheViewSpec;
    } else {
      spec = getTooltipSpecForShow(
        activeType!,
        this._component.getSpec(),
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

    // 合成tooltip内容
    let actualTooltip: IToolTipActual | undefined;
    if (changePositionOnly && this._cacheActualTooltip) {
      actualTooltip = this._cacheActualTooltip;
    } else {
      actualTooltip = this._getActualTooltipContent(pattern, data!, params);
      if (pattern.updateTitle) {
        actualTooltip.title = pattern.updateTitle(actualTooltip.title, data, params);
      }
      if (pattern.updateContent) {
        actualTooltip.content = pattern.updateContent(actualTooltip.content, data, params);
      }
    }

    // 判断tooltip是否为空
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

    // 计算tooltip位置
    const position = this._getActualTooltipPosition(
      actualTooltip,
      getTooltipPatternValue(pattern.position, data, params),
      params,
      this._getParentElement(spec),
      changePositionOnly
    );
    actualTooltip.position = position;
    if (pattern.updatePosition) {
      actualTooltip.position = pattern.updatePosition(actualTooltip.position, data, params);
    }

    // 判断tooltip可见性
    let tooltipVisible = pattern?.visible !== false;
    if (
      !data ||
      event.type === 'mouseout' ||
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

    const spec = this._component.getSpec() as ITooltipSpec;
    /** 用户自定义逻辑 */
    if (spec.handler) {
      spec.handler.release?.();
      return;
    }
    /** 默认逻辑 */
    this._removeTooltip();
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
   * 计算实际的tooltip内容
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
    let tooltipContent: TooltipContent | null = null;
    tooltipContent = getShowContent(pattern, data, params);

    const actualTooltip: IToolTipActual = {
      ...tooltipContent,
      visible: isValid(tooltipContent) ? patternVisible !== false : false, // 最终展示数据为 null 则不展示
      activeType: pattern.activeType
    };

    return actualTooltip;
  };

  /**
   * 计算实际的tooltip位置
   * @param actualTooltip
   * @param position
   * @param event
   * @returns
   */
  protected _getActualTooltipPosition = (
    actualTooltip: IToolTipActual,
    position: TooltipPosition | undefined,
    params: TooltipHandlerParams,
    tooltipParentElement: HTMLElement,
    changePositionOnly: boolean
  ): ITooltipPositionActual => {
    const event = params.event as MouseEvent;
    const { width: tooltipBoxWidth = 0, height: tooltipBoxHeight = 0 } =
      this._getTooltipBoxSize(actualTooltip, changePositionOnly) ?? {};

    const { offsetX, offsetY } = this._option;
    const tooltipSpec = this._component.getSpec();

    const isCanvas = tooltipSpec.renderMode === 'canvas';
    const canvasRect = params?.chart?.getCanvasRect();
    const canvasWidth = canvasRect?.width ?? DEFAULT_CHART_WIDTH;
    const canvasHeight = canvasRect?.height ?? DEFAULT_CHART_HEIGHT;
    let isFixedPosition = false;

    /* 一、计算left、top、right、bottom */
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
    } else if (isValid(position) && actualTooltip.activeType === 'mark') {
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
        switch (position) {
          case TooltipFixedPosition.left:
            left = x1 - tooltipBoxWidth - offsetX;
            top = (y1 + y2) / 2 - tooltipBoxHeight / 2;
            break;
          case TooltipFixedPosition.right:
            left = x2 + offsetX;
            top = (y1 + y2) / 2 - tooltipBoxHeight / 2;
            break;
          case TooltipFixedPosition.top:
            left = (x1 + x2) / 2 - tooltipBoxWidth / 2;
            top = y1 - tooltipBoxHeight - offsetY;
            break;
          case TooltipFixedPosition.bottom:
            left = (x1 + x2) / 2 - tooltipBoxWidth / 2;
            top = y2 + offsetY;
            break;
          case TooltipFixedPosition.inside:
            left = (x1 + x2) / 2 - tooltipBoxWidth / 2;
            top = (y1 + y2) / 2 - tooltipBoxHeight / 2;
            break;
        }
      }
    }

    /* 二、换算成x和y */
    let x: number;
    let y: number;

    const containerSize = {
      width: 0,
      height: 0
    };
    const getDefaultPointValue = (defaultValue = 0): IPoint => ({ x: defaultValue, y: defaultValue });
    let relativePosOffset = getDefaultPointValue();
    let tooltipParentElementRect: IPoint | DOMRect = getDefaultPointValue();
    let chartElementScale = 1;
    let tooltipParentElementScale = 1;

    if (isTrueBrowser(this._env) && !tooltipSpec.confine) {
      // 只有在 browser 模式下才可以获取到 window 对象
      containerSize.width = window.innerWidth;
      containerSize.height = window.innerHeight;

      if (!isCanvas) {
        tooltipParentElementRect = tooltipParentElement?.getBoundingClientRect();
        const chartElement = (this._compiler.getCanvas() ?? this._chartContainer) as HTMLElement;
        const chartElementRect = chartElement?.getBoundingClientRect();
        relativePosOffset = {
          x: chartElementRect.x - (tooltipParentElementRect?.x ?? Infinity),
          y: chartElementRect.y - (tooltipParentElementRect?.y ?? Infinity)
        };
        chartElementScale = getScale(chartElement, chartElementRect);
        tooltipParentElementScale = getScale(tooltipParentElement, tooltipParentElementRect as DOMRect);
      }
    } else {
      containerSize.width = canvasWidth;
      containerSize.height = canvasHeight;
    }

    const { canvasX, canvasY } = event as any;
    if (isValidNumber(left)) {
      x = left;
    } else if (isValidNumber(right)) {
      x = canvasWidth - tooltipBoxWidth - right;
    } else {
      x = canvasX + offsetX;
    }
    if (isValidNumber(top)) {
      y = top;
    } else if (isValidNumber(bottom)) {
      y = canvasHeight - tooltipBoxHeight - bottom;
    } else {
      y = canvasY + offsetY;
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

    if ((x + tooltipBoxWidth) * tooltipParentElementScale + tooltipParentElementRect.x > containerWidth) {
      // 位置不超出视区右界
      if (isFixedPosition) {
        x = (containerWidth - tooltipParentElementRect.x) / tooltipParentElementScale - tooltipBoxWidth;
      } else {
        x -= offsetX * 2 + tooltipBoxWidth;
      }
    }
    if ((y + tooltipBoxHeight) * tooltipParentElementScale + tooltipParentElementRect.y > containerHeight) {
      // 位置不超出视区下界
      if (isFixedPosition) {
        y = (containerHeight - tooltipParentElementRect.y) / tooltipParentElementScale - tooltipBoxHeight;
      } else {
        y -= offsetY * 2 + tooltipBoxHeight;
      }
    }
    if (x * tooltipParentElementScale + tooltipParentElementRect.x < 0) {
      // 位置不超出视区左界
      x = 0 - tooltipParentElementRect.x / tooltipParentElementScale;
    }
    if (y * tooltipParentElementScale + tooltipParentElementRect.y < 0) {
      // 位置不超出视区上界
      y = 0 - tooltipParentElementRect.y / tooltipParentElementScale;
    }

    return { x, y };
  };

  // 计算 tooltip 内容区域的宽高，并缓存结果
  protected _getTooltipBoxSize(actualTooltip: IToolTipActual, changePositionOnly: boolean): IContainerSize | undefined {
    if (!changePositionOnly || isNil(this._attributeCache)) {
      this._attributeCache = getTooltipAttributes(actualTooltip, this._style);
    }
    return {
      width: this._attributeCache?.panel?.width,
      height: this._attributeCache?.panel?.height
    };
  }

  protected _getStyle(): ITooltipStyle {
    const tooltipSpec = this._component.getSpec();
    const { style = {}, enterable, transitionDuration } = tooltipSpec as ITooltipSpec;

    const {
      panel: { backgroundColor, border, shadow, padding },
      titleLabel,
      shape,
      keyLabel,
      valueLabel,
      spaceRow
    } = style;

    // tooltip background style
    const panelStyle: ITooltipPanelStyle = {
      lineWidth: border?.width ?? 0,
      shadow: !!shadow
    };
    if (border?.color) {
      panelStyle.stroke = border.color;
    }
    if (backgroundColor) {
      panelStyle.fill = backgroundColor;
    }

    if (shadow) {
      panelStyle.shadowColor = shadow.color;
      panelStyle.shadowBlur = shadow.blur;
      panelStyle.shadowOffsetX = shadow.x;
      panelStyle.shadowOffsetY = shadow.y;
      panelStyle.shadowSpread = shadow.spread;
    }
    const { radius } = border ?? {};
    if (isValid(radius)) {
      panelStyle.cornerRadius = [radius, radius, radius, radius];
    }

    const globalTheme = this._chartOption.getTheme?.();

    return {
      panel: panelStyle,
      title: getTextAttributes(titleLabel, globalTheme),
      shape: {
        fill: true,
        size: shape?.size ?? 8,
        spacing: shape?.spacing ?? 6
      },
      key: getTextAttributes(keyLabel, globalTheme),
      value: getTextAttributes(valueLabel, globalTheme),
      padding,
      spaceRow,
      enterable,
      transitionDuration
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
    this._style = this._getStyle();
    // 为方法加防抖
    this.changeTooltip = this._throttle(this._changeTooltip) as any;
    this.changeTooltipPosition = this._throttle(this._changeTooltipPosition) as any;
  }

  reInit() {
    this._initFromSpec();
  }
}
