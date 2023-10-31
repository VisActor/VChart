import type { IComponentOption } from '../interface';
import { ComponentTypeEnum } from '../interface';
import type { IModelLayoutOption, IModelRenderOption, ILayoutItem } from '../../model/interface';
import type { IRegion } from '../../region/interface';
import { BaseComponent } from '../base';
import type { BaseEventParams, EventCallback, EventQuery, EventType } from '../../event/interface';
import type { ITooltipHandler, IToolTipLineActual, TooltipActiveType } from '../../typings/tooltip';
import type { Datum, IShowTooltipOption } from '../../typings';
import {
  TooltipResult,
  type ITooltip,
  type ITooltipActiveTypeAsKeys,
  type ITooltipSpec,
  type ITooltipTheme,
  type TooltipHandlerParams,
  type TotalMouseEventData
} from './interface';
import { MarkTooltipProcessor, DimensionTooltipProcessor } from './processor';
import type { IGraphic } from '@visactor/vrender-core';
export type TooltipActualTitleContent = {
  title?: IToolTipLineActual;
  content?: IToolTipLineActual[];
};
export declare class Tooltip extends BaseComponent<any> implements ITooltip {
  static type: ComponentTypeEnum;
  type: ComponentTypeEnum;
  name: string;
  layoutType: ILayoutItem['layoutType'];
  protected _spec: ITooltipSpec;
  static createComponent(spec: any, options: IComponentOption): Tooltip | Tooltip[];
  tooltipHandler?: ITooltipHandler;
  private _alwaysShow;
  private _cacheInfo;
  private _eventList;
  protected _theme: ITooltipTheme;
  protected _processor: ITooltipActiveTypeAsKeys<MarkTooltipProcessor, DimensionTooltipProcessor>;
  protected _isTooltipShown: boolean;
  isTooltipShown(): boolean;
  changeRegions(regions: IRegion[]): void;
  getVRenderComponents(): IGraphic[];
  protected _registerEvent(): void;
  protected _releaseEvent(): void;
  onLayout(ctx: IModelLayoutOption): void;
  onLayoutEnd(ctx: IModelLayoutOption): void;
  onRender(ctx: IModelRenderOption): void;
  created(): void;
  release(): void;
  beforeRelease(): void;
  protected _initHandler(): void;
  protected _initProcessor(): void;
  protected _initEvent(): void;
  protected _mountEvent: (eType: EventType, query: EventQuery, callback: EventCallback<any>) => void;
  protected _getMouseOutHandler: (needPointerDetection?: boolean) => (params: BaseEventParams) => void;
  protected _handleChartMouseOut: (params: BaseEventParams) => void;
  protected _handleMouseMove: (params: BaseEventParams) => void;
  protected _showTooltipByMouseEvent: (
    activeType: TooltipActiveType,
    mouseEventData: TotalMouseEventData,
    params: BaseEventParams,
    useCache?: boolean
  ) => boolean;
  protected _getMouseEventData: (params: BaseEventParams) => TotalMouseEventData;
  protected _hideTooltipByHandler: (params: TooltipHandlerParams) => TooltipResult;
  protected _initTheme(theme?: any): void;
  protected _shouldMergeThemeToSpec(): boolean;
  reInit(theme?: any): void;
  setAttrFromSpec(): void;
  showTooltip(datum: Datum, options: IShowTooltipOption): false | 'none' | TooltipActiveType;
  hideTooltip(): boolean;
  private _isSameAsCacheInfo;
  private _isPointerInChart;
  private _isPointerOnTooltip;
  getVisible(): boolean;
}
export declare const registerTooltip: () => void;
