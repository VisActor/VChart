import type { BaseEventParams } from '../../../event/interface';
import type { TooltipActiveType, TooltipData } from '../../../typings';
import type { TooltipHandlerParams } from '../interface';
import { TooltipResult } from '../interface';
import type { Tooltip } from '../tooltip';
import type { MouseEventData, TooltipInfo } from './interface';
import type { IDimensionInfo } from '../../../event/events/dimension';
export declare abstract class BaseTooltipProcessor {
  readonly component: Tooltip;
  activeType: TooltipActiveType;
  constructor(component: Tooltip);
  abstract showTooltip(info: TooltipInfo, params: BaseEventParams, changePositionOnly: boolean): TooltipResult;
  abstract shouldHandleTooltip(params: BaseEventParams, mouseEventData: Partial<MouseEventData>): boolean;
  abstract getMouseEventData(params: BaseEventParams): MouseEventData;
  protected _showTooltipByHandler: (data: TooltipData | undefined, params: TooltipHandlerParams) => TooltipResult;
  protected _preprocessDimensionInfo(dimensionInfo?: IDimensionInfo[]): IDimensionInfo[] | undefined;
  protected _getDimensionInfo(params: BaseEventParams): IDimensionInfo[];
}
