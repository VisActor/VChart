import type { DimensionEventParams } from '../../../event/events/dimension/interface';
import type { DimensionTooltipInfo, MarkTooltipInfo } from '../processor/interface';
import type { Datum, IShowTooltipOption } from '../../../typings';
import type { IComponent } from '../../interface';
export type TooltipHandlerParams = DimensionEventParams & {
    changePositionOnly?: boolean;
    tooltip: ITooltip;
};
export interface ITooltipActiveTypeAsKeys<T, K> {
    mark: T;
    dimension: K;
}
export type TotalMouseEventData = {
    tooltipInfo: Partial<ITooltipActiveTypeAsKeys<MarkTooltipInfo, DimensionTooltipInfo>>;
    ignore: Partial<ITooltipActiveTypeAsKeys<boolean, boolean>>;
};
export declare const enum TooltipResult {
    success = 0,
    failed = 1
}
export interface ITooltip extends IComponent {
    getVisible: () => boolean;
    showTooltip: (datum: Datum, options: IShowTooltipOption) => void;
}
