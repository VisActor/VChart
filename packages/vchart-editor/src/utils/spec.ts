import { isEqual } from '@visactor/vutils';
import type { IChartModel } from './../elements/chart/interface';
import type { IModelInfoSpecKey } from './../core/interface';
import type { IModelInfo } from '../core/interface';

export function isSameModelInfo(info1: IModelInfo, info2: IModelInfo) {
  if ('id' in info1) {
    return info1.id === info2.id;
  }
  return (
    info1.specKey === (<IModelInfoSpecKey>info2).specKey && info1.specIndex === (<IModelInfoSpecKey>info2).specIndex
  );
}

export function isModelInfoMatchSpec(info: IModelInfo, spec: { id: string | number }, specKey: string, index: number) {
  if ('id' in info) {
    return info.id === spec.id;
  }
  return info.specKey === specKey && info.specIndex === index;
}

export function isModelMatchModelInfo(model: IChartModel, info: IModelInfo) {
  if ('id' in info && info.id !== undefined) {
    return info.id === model.userId;
  }
  return info.specKey === model.specKey && info.specIndex === model.getSpecIndex();
}

export function diffSpec(source: {}, target: {}) {
  const from = {};
  const to = {};
  _diffSpec(source, target, from, to);
  return { from, to };
}

export function _diffSpec(source: {}, target: {}, from: {}, to: {}) {
  const sourceKeys = Object.keys(source).sort();
  const targetKeys = Object.keys(target).sort();
  let s = 0;
  let t = 0;
  while (s < sourceKeys.length && t < targetKeys.length) {
    // check
    if (sourceKeys[s] === targetKeys[t]) {
      const key = sourceKeys[s];
      const type = Object.prototype.toString.call(source[key]);
      // type not equal
      if (type !== Object.prototype.toString.call(target[key])) {
        from[key] = source[key];
        to[key] = target[key];
      } else {
        if (type === '[object Object]') {
          from[key] = {};
          to[key] = {};
          _diffSpec(source[key], target[key], from[key], to[key]);
          if (Object.keys(from[key]).length === 0) {
            delete from[key];
          }
          if (Object.keys(to[key]).length === 0) {
            delete to[key];
          }
        }
        // 数组类型判定有点麻烦，会退也很痛苦，先直接判定是否相等
        // else if (type === '[object Array]') {
        //   from[key] = [];
        //   to[key] = [];
        //   diffSpec(source[key], target[key], from[key], to[key]);
        // }
        else if (!isEqual(source[key], target[key])) {
          // 其他类型 直接判定是否相等
          from[key] = source[key];
          to[key] = target[key];
        }
      }
      s++;
      t++;
    } else if (sourceKeys[s].localeCompare(targetKeys[t]) === -1) {
      // s 更小 当前 s 匹配失败
      from[sourceKeys[s]] = source[sourceKeys[s]];
      s++;
    } else {
      // t 更小 当前 t 匹配失败
      to[targetKeys[t]] = target[targetKeys[t]];
      t++;
    }
  }
  for (; s < sourceKeys.length; s++) {
    from[sourceKeys[s]] = source[sourceKeys[s]];
  }

  for (; t < targetKeys.length; t++) {
    to[targetKeys[t]] = target[targetKeys[t]];
  }
}
