import type { IGroupTooltipPattern, ITooltipActual, ITooltipPattern, Maybe, MaybeArray, TooltipActiveType, TooltipData } from '../../../typings';
import type { ITooltipActiveTypeAsKeys, TooltipHandlerParams, TooltipResult } from './common';
import type { ITooltipTheme } from './theme';
export interface ITooltipSpec extends Partial<ITooltipActiveTypeAsKeys<ITooltipPattern, ITooltipPattern, IGroupTooltipPattern>> {
    visible?: boolean;
    activeType?: TooltipActiveType | TooltipActiveType[];
    trigger?: MaybeArray<'hover' | 'click'> | 'none';
    triggerOff?: MaybeArray<'hover' | 'click'> | 'none';
    hideTimer?: number;
    lockAfterClick?: boolean;
    style?: Omit<ITooltipTheme<string>, 'offset'>;
    handler?: Partial<ITooltipHandlerSpec>;
    renderMode?: 'html' | 'canvas';
    confine?: boolean;
    className?: string;
    parentElement?: Maybe<string | HTMLElement | HTMLCanvasElement>;
    enterable?: boolean;
    transitionDuration?: number;
    throttleInterval?: number;
    updateElement?: (tooltipElement: HTMLElement, actualTooltip: ITooltipActual, params: TooltipHandlerParams) => void;
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
