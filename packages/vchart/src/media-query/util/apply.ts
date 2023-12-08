import { array, isFunction, isObject, isValid } from '@visactor/vutils';
import type { IVChart } from '../../core';
import type { IMediaQueryItem, IMediaQueryActionResult } from '../interface';
import { executeMediaQueryAction } from './action';

/**
 * 强制执行一个媒体查询
 * @returns 返回新的图表 spec
 */
export const applyMediaQueryItem = (
  queryItem: IMediaQueryItem,
  chartSpec: any,
  globalInstance: IVChart,
  reverse?: boolean
): IMediaQueryActionResult => {
  const { query, action } = queryItem;
  let hasChanged = false;
  // 执行
  array(action).forEach(actionItem => {
    if (isFunction(actionItem)) {
      const result = actionItem(reverse ? 'inactive' : 'active', query, chartSpec, globalInstance);
      if (isValid(result) && isObject(result)) {
        chartSpec = result;
        hasChanged = true;
      }
    } else if (!reverse) {
      const result = executeMediaQueryAction(actionItem, query, chartSpec, globalInstance);
      chartSpec = result.chartSpec;
      hasChanged ||= result.hasChanged;
    } else {
      hasChanged = true;
    }
  });
  return { chartSpec, hasChanged };
};
