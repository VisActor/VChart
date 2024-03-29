import type { Datum, ITooltipLinePattern, ITooltipPattern, TooltipContentProperty, TooltipData, TooltipPatternProperty } from '../../../typings';
import type { TooltipHandlerParams } from '../interface';
export declare const getTooltipContentValue: <T>(field?: TooltipContentProperty<T>, datum?: any, params?: TooltipHandlerParams, formatter?: string) => T;
export declare const getTooltipPatternValue: <T>(field?: TooltipPatternProperty<T>, data?: TooltipData, params?: TooltipHandlerParams) => T;
export declare const getTooltipContentPattern: (field?: ITooltipPattern['content'], data?: TooltipData, params?: TooltipHandlerParams) => Array<ITooltipLinePattern> | undefined;
export declare function getFirstDatumFromTooltipData(data: TooltipData): Datum;
