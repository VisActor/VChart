import type { TooltipActiveType, TooltipData } from '../../../typings';
import type { IComponent } from '../../interface/common';
import type { TooltipHandlerParams } from './common';
export type TooltipEventParams = TooltipHandlerParams & {
    activeType?: TooltipActiveType;
    tooltipData?: TooltipData;
    tooltip: IComponent;
};
