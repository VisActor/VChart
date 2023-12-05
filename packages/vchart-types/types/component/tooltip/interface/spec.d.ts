import type { IToolTipActual, ITooltipPattern, Maybe, TooltipActiveType, TooltipData } from '../../../typings';
import type { ITooltipActiveTypeAsKeys, TooltipHandlerParams, TooltipResult } from './common';
import type { ITooltipTheme } from './theme';
export interface ITooltipSpec extends Partial<ITooltipActiveTypeAsKeys<ITooltipPattern, ITooltipPattern>> {
    visible?: boolean;
    activeType?: TooltipActiveType | TooltipActiveType[];
    trigger?: 'hover' | 'click' | 'none';
    triggerOff?: 'hover' | 'click' | 'none';
    style?: Omit<ITooltipTheme<string>, 'offset'>;
    handler?: Partial<ITooltipHandlerSpec>;
    renderMode?: 'html' | 'canvas';
    confine?: boolean;
    className?: string;
    parentElement?: Maybe<string | HTMLElement | HTMLCanvasElement>;
    enterable?: boolean;
    transitionDuration?: number;
    throttleInterval?: number;
    updateElement?: (tooltipElement: HTMLElement, actualTooltip: IToolTipActual, params: TooltipHandlerParams) => void;
    offset?: {
        x?: number;
        y?: number;
    };
}
export interface ITooltipHandlerSpec {
    showTooltip: (activeType: TooltipActiveType, tooltipData: TooltipData, params: TooltipHandlerParams) => Maybe<TooltipResult>;
    hideTooltip: (params: TooltipHandlerParams) => Maybe<TooltipResult>;
    release: () => void;
    isTooltipShown?: () => boolean;
}
