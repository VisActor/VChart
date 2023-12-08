import { array, isArray, isFunction, isNil, isObject } from '@visactor/vutils';
import { IMediaQueryItem, IMediaQuerySpec } from '../interface';

/**
 * 判断一个 spec 是否包含另一个 spec 片段
 * @param spec 原始 spec
 * @param searchSpec 要匹配的 spec 片段
 */
export const includeSpec = <T = any>(spec: Partial<T>, searchSpec: Partial<T>): boolean => {
  if (spec === searchSpec) {
    return true;
  }
  if (isFunction(spec) || isFunction(searchSpec)) {
    return false;
  }
  if (isArray(spec) && isArray(searchSpec)) {
    return searchSpec.every(searchItem => spec.some(item => includeSpec(item, searchItem)));
  }
  if (isObject(spec) && isObject(searchSpec)) {
    return Object.keys(searchSpec).every(key => includeSpec(spec[key], searchSpec[key]));
  }
  return false;
};

export const setProperty = (target: any, path: Array<string | number>, value: any) => {
  const key = path[0];
  if (isNil(key)) {
    return;
  }
  if (path.length === 1) {
    target[key] = value;
    return;
  }
  if (isNil(target[key])) {
    if (typeof key === 'string') {
      target[key] = {};
    } else if (typeof key === 'number') {
      target[key] = [];
    }
  }
  setProperty(target[key], path.slice(1), value);
};

/** 比较媒体查询 spec，返回是否相同 */
export const isSameMediaQuerySpec = (spec1?: IMediaQuerySpec, spec2?: IMediaQuerySpec): boolean => {
  if (spec1 === spec2 || (!spec1 && !spec2)) {
    return true;
  }
  if (!spec1 || !spec2) {
    return false;
  }
  if (spec1.length !== spec2.length) {
    return false;
  }
  return spec1.every((item1, i) => isSameMediaQueryItem(item1, spec2[i]));
};

/** 比较媒体查询 spec 具体项，返回是否相同 */
export const isSameMediaQueryItem = (item1: IMediaQueryItem, item2: IMediaQueryItem): boolean => {
  if (item1 === item2) {
    return true;
  }
  if (array(item1.action).length !== array(item2.action).length) {
    return false;
  }
  try {
    const str1 = JSON.stringify(item1);
    const str2 = JSON.stringify(item2);
    return str1 === str2;
  } catch {
    return false;
  }
};
