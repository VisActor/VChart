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
  getPositionType,
  isFixedTooltipPositionPattern,
  isGlobalTooltipPositionPattern
} from './utils/position';
import type { IGroup } from '@visactor/vrender-core';
import type { AABBBounds } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { isNumber, isObject, isValidNumber, isValid, throttle, isNil, isFunction } from '@visactor/vutils';
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
import { getTooltipPatternValue } from '../../../component/tooltip/utils';
import type { IDimensionData, IDimensionInfo } from '../../../event/events/dimension/interface';

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
    const { tooltipSpec, activeTooltipSpec, changePositionOnly } = params;

    if (!activeTooltipSpec) {
      return TooltipResult.failed;
    }

    const activeType = activeTooltipSpec.activeType;

    /** 用户自定义逻辑 */
    if (activeTooltipSpec.handler) {
      return activeTooltipSpec.handler.showTooltip?.(activeType, data, params) ?? TooltipResult.success;
    }

    /** 默认逻辑 */
    const pattern = activeTooltipSpec;

    // 计算 tooltip 位置
    const position = this._getActualTooltipPosition(
      activeTooltipSpec,
      params,
      this._getTooltipBoxSize(activeTooltipSpec, changePositionOnly)
    );
    activeTooltipSpec.position = position;
    const updatePosition = activeTooltipSpec.updatePosition ?? tooltipSpec[activeType]?.updatePosition;

    if (updatePosition) {
      activeTooltipSpec.position = updatePosition(activeTooltipSpec.position, data, params);
    }

    // 判断 tooltip 可见性
    let tooltipVisible = pattern?.visible !== false;
    if (
      !data ||
      event.type === 'pointerout' ||
      !activeTooltipSpec.visible ||
      (!activeTooltipSpec.title && !activeTooltipSpec.content)
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
    const { tooltipSpec } = params;
    const invalidPosition = {
      x: Infinity,
      y: Infinity
    };
    if (!tooltipSpec) {
      return invalidPosition;
    }
    const event = params.event as MouseEvent;
    const { activeType, data } = actualTooltip;
    const firstDim =
      activeType === 'dimension' ? (data as IDimensionInfo[])[0]?.data?.[0] : (data as IDimensionData[])?.[0];

    const { offsetX, offsetY } = this._option;

    const spec = tooltipSpec[activeType];
    const position = getTooltipPatternValue(spec?.position, data, params);
    const positionMode =
      getTooltipPatternValue(spec?.positionMode, data, params) ?? (activeType === 'mark' ? 'mark' : 'pointer');
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
        const tooltipParentElement = this._getParentElement(tooltipSpec);
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

    const calcPos: { top?: number; bottom?: number; left?: number; right?: number } = {};
    const pointerFixedPosition: {
      x: TooltipFixedPosition;
      y: TooltipFixedPosition;
    } = { x: position as any, y: position as any };

    const processCartesianFixedPosition = ({ orient, mode, offset }: ITooltipPositionFixedValue, dim: 'x' | 'y') => {
      let dim1: number;
      let dim2: number;
      const model = params.model as ILayoutModel;
      const startPoint = model?.getLayoutStartPoint();
      const dimOffset = offset ?? (dim === 'x' ? offsetX : offsetY);

      if (mode === 'mark') {
        isFixedPosition = true;
        const element = params.item as IElement;
        const bounds = element?.getBounds() as AABBBounds;
        if (bounds && startPoint) {
          dim1 = (dim === 'x' ? bounds.x1 : bounds.y1) + startPoint[dim];
          dim2 = (dim === 'x' ? bounds.x2 : bounds.y2) + startPoint[dim];
        }
      } else if (
        mode === 'crosshair' &&
        firstDim?.series?.coordinate === 'cartesian' &&
        firstDim.datum &&
        firstDim.datum.length
      ) {
        isFixedPosition = true;
        const rect = getCartesianCrosshairRect(firstDim, startPoint);
        if (rect) {
          dim1 = rect.start[dim];
          dim2 = rect.end[dim];
        }
      } else {
        pointerFixedPosition[dim] = orient;
      }

      if (isFixedPosition) {
        const posKey = dim === 'x' ? 'left' : 'top';
        const boxSize = dim === 'x' ? tooltipBoxWidth : tooltipBoxHeight;
        switch (getPositionType(orient, dim)) {
          case -2:
            calcPos[posKey] = dim1 - boxSize * tooltipSizeScale - dimOffset;
            break;
          case 0:
            calcPos[posKey] = (dim1 + dim2) / 2 - (boxSize * tooltipSizeScale) / 2;
            break;
          case -1:
            calcPos[posKey] = (dim1 + dim2) / 2 - boxSize * tooltipSizeScale - dimOffset;
            break;
          case 1:
            calcPos[posKey] = (dim1 + dim2) / 2 + dimOffset;
            break;
          case 2:
            calcPos[posKey] = dim2 + dimOffset;
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
        calcPos.left = getActualTooltipPositionValue(posLeft, event);
        calcPos.top = getActualTooltipPositionValue(posTop, event);
        calcPos.right = getActualTooltipPositionValue(posRight, event);
        calcPos.bottom = getActualTooltipPositionValue(posBottom, event);
      } else if (isFixedTooltipPositionPattern(position)) {
        const { x, y } = position;
        if (isNumber(x) || isFunction(x)) {
          calcPos.left = getActualTooltipPositionValue(x as number | ((event: MouseEvent) => number), event);
        } else {
          processCartesianFixedPosition(x as ITooltipPositionFixedValue, 'x');
        }
        if (isNumber(y) || isFunction(y)) {
          calcPos.top = getActualTooltipPositionValue(y as number | ((event: MouseEvent) => number), event);
        } else {
          processCartesianFixedPosition(y as ITooltipPositionFixedValue, 'y');
        }
      }
    } else if (isValid(position)) {
      processCartesianFixedPosition({ orient: position, mode: positionMode } as ITooltipPositionFixedValue, 'x');
      processCartesianFixedPosition({ orient: position, mode: positionMode } as ITooltipPositionFixedValue, 'y');
    }

    /* 二、换算成 x 和 y */
    let x: number;
    let y: number;

    const { canvasX, canvasY } = event as any;
    if (isValidNumber(calcPos.left)) {
      x = calcPos.left;
    } else if (isValidNumber(calcPos.right)) {
      x = canvasWidth - tooltipBoxWidth * tooltipSizeScale - calcPos.right;
    } else {
      const x0 = canvasX;
      const xPosType = getPositionType(pointerFixedPosition.x, 'x');

      if (xPosType > 0) {
        x = x0 + offsetX;
      } else {
        x = x0 - (tooltipBoxWidth * tooltipSizeScale) / 2 + (xPosType < 0 ? -1 : 0) * offsetX;
      }
    }
    if (isValidNumber(calcPos.top)) {
      y = calcPos.top;
    } else if (isValidNumber(calcPos.bottom)) {
      y = canvasHeight - tooltipBoxHeight * tooltipSizeScale - calcPos.bottom;
    } else {
      const y0 = canvasY;
      const yPosType = getPositionType(pointerFixedPosition.y, 'y');

      if (yPosType > 0) {
        y = y0 + offsetY;
      } else {
        y = y0 - (tooltipBoxWidth * tooltipSizeScale) / 2 + (yPosType < 0 ? -1 : 0) * offsetY;
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
    const leftEdge = -tooltipParentElementRect.x / tooltipParentElementScale;
    const rightEdge = (containerWidth - tooltipParentElementRect.x) / tooltipParentElementScale - tooltipBoxWidth;
    const topEdge = -tooltipParentElementRect.y / tooltipParentElementScale;
    const bottomEdge = (containerHeight - tooltipParentElementRect.y) / tooltipParentElementScale - tooltipBoxHeight;

    // 处理左右
    const horizontalType = getPositionType(position as TooltipFixedPosition, 'x');
    if (horizontalType !== 2 && x < leftEdge) {
      // 优先检测left
      if (isFixedPosition) {
        x = leftEdge;
      } else {
        if (getPositionType(position as TooltipFixedPosition, 'x') === 0) {
          // 从居中 挪至 右侧
          x += offsetX + tooltipBoxWidth / 2;
        } else {
          // 从居左/左侧 挪至 居右/右侧
          x += offsetX * 2 + tooltipBoxWidth;
        }

        if (x > rightEdge) {
          // 位置不超出视区右界
          x = rightEdge;
        }
      }
    } else if (horizontalType !== -2 && x > rightEdge) {
      // 优先检测right
      // 位置不超出视区右界
      if (isFixedPosition) {
        x = rightEdge;
      } else {
        if (getPositionType(position as TooltipFixedPosition, 'x') === 0) {
          // 从居中 挪至 左侧
          x -= offsetX + tooltipBoxWidth / 2;
        } else {
          // 从居右/右侧 挪至 居左/左侧
          x -= offsetX * 2 + tooltipBoxWidth;
        }

        if (x < leftEdge) {
          // 位置不超出视区左界
          x = leftEdge;
        }
      }
    }

    // 处理上下
    const verticalType = getPositionType(position as TooltipFixedPosition, 'y');
    if (verticalType !== 2 && y < topEdge) {
      // top
      // 位置不超出视区上界
      if (isFixedPosition) {
        y = topEdge;
      } else {
        if (getPositionType(position as TooltipFixedPosition, 'y') === 0) {
          // 从居中 挪至 底部
          y += offsetY + tooltipBoxHeight / 2;
        } else {
          // 从居上/顶部 挪至 居底/底部

          y += offsetY * 2 + tooltipBoxHeight;
        }
        if (y > bottomEdge) {
          // 位置不超出视区下界
          y = bottomEdge;
        }
      }
    } else if (verticalType !== -2 && y > bottomEdge) {
      // 位置不超出视区下界
      if (isFixedPosition) {
        y = bottomEdge;
      } else {
        if (getPositionType(position as TooltipFixedPosition, 'y') === 0) {
          // 从居中 挪至 顶部
          y -= offsetY + tooltipBoxHeight / 2;
        } else {
          // 从居底/底部 挪至 居上/顶部
          y -= offsetY * 2 + tooltipBoxHeight;
        }
        if (y < topEdge) {
          // 位置不超出视区上界
          y = topEdge;
        }
      }
    }

    const result = { x, y };
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
