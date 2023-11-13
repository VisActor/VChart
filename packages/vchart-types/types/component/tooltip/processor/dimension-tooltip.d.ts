import type { BaseEventParams } from '../../../event/interface';
import type { TooltipActiveType } from '../../../typings';
import type { DimensionTooltipInfo, MouseEventData } from './interface';
import { BaseTooltipProcessor } from './base';
export declare class DimensionTooltipProcessor extends BaseTooltipProcessor {
    activeType: TooltipActiveType;
    showTooltip(info: DimensionTooltipInfo, params: BaseEventParams, changePositionOnly: boolean): import("../interface").TooltipResult;
    shouldHandleTooltip(params: BaseEventParams, mouseEventData: Partial<MouseEventData>): boolean;
    getMouseEventData(params: BaseEventParams): MouseEventData;
}
