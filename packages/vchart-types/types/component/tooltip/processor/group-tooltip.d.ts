import type { BaseEventParams } from '../../../event/interface';
import type { TooltipActiveType } from '../../../typings';
import type { DimensionTooltipInfo, GroupTooltipInfo, MouseEventData } from './interface';
import { BaseTooltipProcessor } from './base';
export declare class GroupTooltipProcessor extends BaseTooltipProcessor {
    activeType: TooltipActiveType;
    showTooltip(info: GroupTooltipInfo, params: BaseEventParams, changePositionOnly: boolean): import("../interface").TooltipResult;
    shouldHandleTooltip(params: BaseEventParams, mouseEventData: Partial<MouseEventData>): boolean;
    getMouseEventData(params: BaseEventParams, dimensionInfo?: DimensionTooltipInfo): MouseEventData;
    protected _getGroupDatum(params: BaseEventParams): any;
}
