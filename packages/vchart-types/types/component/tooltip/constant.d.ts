import type { ITooltipLineActual, TooltipActiveType } from '../../typings';
export declare class TooltipHandlerType {
    static dom: string;
    static canvas: string;
}
export declare const TOOLTIP_EL_CLASS_NAME = "vchart-tooltip-element";
export declare const TOOLTIP_MAX_LINE_COUNT = 20;
export declare const TOOLTIP_OTHERS_LINE: ITooltipLineActual;
export declare const TOOLTIP_TYPES: TooltipActiveType[];
