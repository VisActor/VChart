import type { ITooltipHandlerSpec } from '../../component/tooltip/interface';
import type { IDimensionData, IDimensionInfo } from '../../event/events/dimension/interface';
export interface ITooltipHandler extends ITooltipHandlerSpec {
    getTooltipContainer?: () => any;
    reInit?: () => any;
}
export type TooltipData = IDimensionInfo[] | IDimensionData[];
export type TooltipActiveType = 'mark' | 'dimension';
