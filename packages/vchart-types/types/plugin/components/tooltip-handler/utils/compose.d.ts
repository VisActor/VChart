import type { IToolTipLinePattern, ITooltipPattern, TooltipData, IToolTipLineActual } from '../../../../typings/tooltip';
import type { TooltipActualTitleContent, TooltipHandlerParams } from '../../../../component/tooltip';
export declare const getShowContent: (pattern: ITooltipPattern, data: TooltipData, params: TooltipHandlerParams) => TooltipActualTitleContent | null;
export declare const getOneLineData: (datum: any, config: IToolTipLinePattern, params: TooltipHandlerParams) => IToolTipLineActual;
