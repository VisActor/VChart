import type { IVChart } from '../../../../core';
import type { IMediaQueryAction, IMediaQueryCondition, IMediaQueryActionResult } from '../interface';
export declare const executeMediaQueryAction: <T extends Record<string, unknown>>(action: IMediaQueryAction<T>, query: IMediaQueryCondition, chartSpec: any, globalInstance: IVChart) => IMediaQueryActionResult;
