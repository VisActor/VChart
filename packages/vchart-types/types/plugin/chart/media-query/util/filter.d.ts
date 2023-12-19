import type { IVChart } from '../../../../core';
import type { IMediaQueryAction, IMediaQueryActionFilterResult, IMediaQueryCondition, MediaQueryActionFilter, MediaQueryActionFilterType } from '../interface';
export declare const executeMediaQueryActionFilter: <T extends Record<string, unknown>>(filterType: MediaQueryActionFilterType, filter: MediaQueryActionFilter<T>, action: IMediaQueryAction<T>, query: IMediaQueryCondition, chartSpec: any, globalInstance: IVChart) => IMediaQueryActionFilterResult;
export declare const executeMediaQueryActionFilterType: <T extends Record<string, unknown>>(filterType: MediaQueryActionFilterType, chartSpec: any, globalInstance: IVChart) => IMediaQueryActionFilterResult<T>;
