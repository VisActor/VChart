import type { IVChart } from '../../core';
import type { IModel } from '../../model/interface';
import { isArray, isFunction, isNil, mergeSpec } from '../../util';
import type { IMediaQueryAction, IMediaQueryCondition, IMediaQueryActionResult } from '../interface';
import { setProperty } from './common';
import { executeMediaQueryActionFilter } from './filter';

/** 执行媒体查询对应的动作 */
export const executeMediaQueryAction = <T extends Record<string, unknown>>(
  action: IMediaQueryAction<T>,
  query: IMediaQueryCondition,
  chartSpec: any,
  globalInstance: IVChart
): IMediaQueryActionResult => {
  const { spec, filter, filterType, forceAppend } = action;
  const {
    filteredModels,
    filterInfoForAppend: { isChart, modelType, specKey, type }
  } = executeMediaQueryActionFilter<T>(filterType, filter, action, query, globalInstance);
  if (filteredModels.length === 0 && !forceAppend) {
    return {
      chartSpec,
      hasChanged: false
    };
  }
  // 修改现有图表元素的 spec
  const targetSpec = mergeSpec({}, chartSpec);
  const newSpec = isFunction(spec) ? spec(filteredModels, action, query) : spec;
  for (const model of filteredModels) {
    if (isChart) {
      return mergeSpec(targetSpec, newSpec);
    }
    const modelSpec = mergeSpec({}, model.getSpec(), newSpec);
    setProperty(targetSpec, (model as IModel).getSpecPath(), modelSpec);
  }
  // 如果没有匹配到图表元素，且 forceAppend 为 true，则添加新元素
  if (filteredModels.length === 0 && forceAppend) {
    const newSpecToAppend = {
      type,
      ...newSpec
    };
    if (isArray(targetSpec[specKey])) {
      targetSpec[specKey].push(newSpecToAppend);
    } else if (isNil(targetSpec[specKey])) {
      if (modelType === 'component') {
        targetSpec[specKey] = newSpecToAppend;
      } else {
        targetSpec[specKey] = [newSpecToAppend];
      }
    } else {
      targetSpec[specKey] = [targetSpec[specKey], newSpecToAppend];
    }
  }
  return {
    chartSpec: targetSpec,
    hasChanged: true
  };
};
