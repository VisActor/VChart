import type { Options } from './constants';
import type { Maybe } from '../../../typings';
import { TooltipPositionMode } from '../../../typings';
import type {
  TooltipData,
  IToolTipActual,
  TooltipActiveType,
  ITooltipHandler,
  ITooltipPattern,
  ITooltipPositionActual,
  TooltipPosition
} from '../../../typings/tooltip';
import type { Tooltip } from '../tooltip';
import type { ITooltipSpec, TooltipHandlerParams } from '../interface';
import { TooltipResult } from '../interface';
import type { ITooltipStyle } from './interface';
import type { IGroup } from '@visactor/vrender-core';
import type { Compiler } from '../../../compile/compiler';
import type { IContainerSize, TooltipAttributes } from '@visactor/vrender-components';
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
export declare abstract class BaseTooltipHandler implements ITooltipHandler {
  readonly type: string;
  protected _visible: boolean;
  protected _option: Options;
  protected _chartOption: IChartOption;
  protected _id: string;
  get id(): string;
  protected _env:
    | 'desktop-browser'
    | 'mobile-browser'
    | 'node'
    | 'worker'
    | 'miniApp'
    | 'wx'
    | 'desktop-miniApp'
    | 'lynx';
  get env(): 'desktop-browser' | 'mobile-browser' | 'node' | 'worker' | 'miniApp' | 'wx' | 'desktop-miniApp' | 'lynx';
  protected _component: Tooltip;
  protected _chartContainer: Maybe<HTMLElement>;
  protected _compiler: Compiler;
  private _cacheViewSpec;
  private _cacheActualTooltip;
  protected _attributeCache?: TooltipAttributes | null;
  protected _style: Partial<ITooltipStyle>;
  protected _container: Maybe<IGroup | HTMLElement>;
  constructor(tooltipId: string, component: Tooltip);
  showTooltip: (activeType: TooltipActiveType, data: TooltipData, params: TooltipHandlerParams) => TooltipResult;
  protected changeTooltip: ChangeTooltipFunc;
  protected _changeTooltip: ChangeTooltipFunc;
  protected changeTooltipPosition: ChangeTooltipPositionFunc;
  protected _changeTooltipPosition: ChangeTooltipPositionFunc;
  hideTooltip(params: TooltipHandlerParams): TooltipResult;
  release(): void;
  protected abstract _updateTooltip(visible: boolean, params: TooltipHandlerParams, domData?: IToolTipActual): void;
  protected abstract _removeTooltip(): void;
  protected _throttle(callback: any): (...args: unknown[]) => unknown;
  protected _getDefaultOption(): Options;
  protected _getActualTooltipContent: (
    pattern: ITooltipPattern,
    data: TooltipData,
    params: TooltipHandlerParams
  ) => IToolTipActual;
  protected _getActualTooltipPosition: (
    actualTooltip: IToolTipActual,
    position: TooltipPosition | undefined,
    positionMode: TooltipPositionMode | undefined,
    params: TooltipHandlerParams,
    tooltipParentElement: HTMLElement,
    changePositionOnly: boolean
  ) => ITooltipPositionActual;
  protected _getTooltipBoxSize(actualTooltip: IToolTipActual, changePositionOnly: boolean): IContainerSize | undefined;
  protected _getStyle(): Partial<ITooltipStyle>;
  protected _getParentElement(spec: ITooltipSpec): HTMLElement;
  getTooltipContainer(): IGroup | HTMLElement;
  protected _initFromSpec(): void;
  reInit(): void;
}
export {};
