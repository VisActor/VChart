import type { Datum } from '@visactor/vgrammar-core';
import type { MaybeArray, TooltipContentProperty, TooltipData, TooltipPatternProperty } from '../../../../typings';
import type { TooltipHandlerParams } from '../../interface';
export declare function escapeHTML(value: any): string;
export declare const getTooltipContentValue: <T>(
  field?: TooltipContentProperty<T>,
  datum?: any,
  params?: TooltipHandlerParams
) => T;
export declare const getTooltipPatternValue: <T>(
  field?: MaybeArray<TooltipPatternProperty<T>>,
  data?: TooltipData,
  params?: TooltipHandlerParams
) => MaybeArray<TooltipPatternProperty<T>> extends TooltipPatternProperty<T>[] ? MaybeArray<T> : T;
export declare function getFirstDatumFromTooltipData(data: TooltipData): Datum;
export declare function pickFirstValidValue<T>(isValid: (element?: T) => any, ...elements: T[]): T | undefined;
export declare function convertToColorString(color: any, defaultColor?: string): string;
export declare const getScale: (element: HTMLElement, boundingClientRect?: DOMRect) => number;
