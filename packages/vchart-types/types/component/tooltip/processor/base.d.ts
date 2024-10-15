import type { BaseEventParams } from '../../../event/interface';
import type { ITooltipActual, TooltipActiveType, TooltipData } from '../../../typings';
import type { TooltipHandlerParams } from '../interface';
import { TooltipResult } from '../interface/common';
import type { Tooltip } from '../tooltip';
import type { MouseEventData, TooltipInfo } from './interface';
import type { IDimensionInfo } from '../../../event/events/dimension';
export declare abstract class BaseTooltipProcessor {
    readonly component: Tooltip;
    abstract activeType: TooltipActiveType;
    protected _cacheActiveSpec: ITooltipActual | undefined;
    constructor(component: Tooltip);
    abstract showTooltip(info: TooltipInfo, params: BaseEventParams, changePositionOnly: boolean): TooltipResult;
    abstract getMouseEventData(params: BaseEventParams): MouseEventData;
    protected _showTooltipByHandler: (data: TooltipData | undefined, params: TooltipHandlerParams) => TooltipResult;
    protected _preprocessDimensionInfo(dimensionInfo?: IDimensionInfo[]): IDimensionInfo[] | undefined;
    protected _updateViewSpec(data: TooltipData, params: TooltipHandlerParams): void;
    shouldHandleTooltip(params: BaseEventParams, info: TooltipInfo): boolean;
    clearCache(): void;
}
