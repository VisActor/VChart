import type { Datum } from '@visactor/vgrammar-core';
import type { IToolTipLinePattern, ITooltipPattern, MaybeArray, TooltipContentProperty, TooltipData, TooltipPatternProperty } from '../../../../typings';
import type { ITooltipTextStyle } from '../interface/style';
import type { TooltipRichTextAttrs } from '@visactor/vrender-components';
import type { TooltipHandlerParams } from '../../../../component/tooltip';
export declare function escapeHTML(value: any): string;
export declare const getTooltipContentValue: <T>(field?: TooltipContentProperty<T>, datum?: any, params?: TooltipHandlerParams) => T;
export declare const getTooltipPatternValue: <T>(field?: TooltipPatternProperty<T>, data?: TooltipData, params?: TooltipHandlerParams) => T;
export declare const getTooltipContentPattern: (field?: ITooltipPattern['content'], data?: TooltipData, params?: TooltipHandlerParams) => Array<IToolTipLinePattern> | undefined;
export declare function getFirstDatumFromTooltipData(data: TooltipData): Datum;
export declare function pickFirstValidValue<T>(isValid: (element?: T) => any, ...elements: T[]): T | undefined;
export declare function convertToColorString(color: any, defaultColor?: string): string;
export declare const getScale: (element: HTMLElement, boundingClientRect?: DOMRect) => number;
interface ITooltipTextInfo {
    width: number;
    height: number;
    text: MaybeArray<number> | MaybeArray<string> | TooltipRichTextAttrs;
}
export declare const measureTooltipText: (text: string | TooltipRichTextAttrs, style: ITooltipTextStyle) => ITooltipTextInfo;
export {};
