import { ISpec } from '@visactor/vchart';
import { isArray, isArrayLike, isNil, isObject, isPlainObject, isString, isValid } from '@visactor/vutils';

const directlyAssignSpecKeys = ['seriesId', 'text'];

export function isModelInfoMatchSpec(
  info: any,
  spec: { id: string | number },
  specKey: string,
  index: number,
  option: {
    ignoreIdMatch: boolean;
  } = {
    ignoreIdMatch: false
  }
) {
  if (!isNil(info.id)) {
    const match = info.id === spec.id;
    if (match || option.ignoreIdMatch !== true) {
      return match;
    }
  }
  return info.specKey === specKey && info.specIndex === index;
}

function baseMerge(target: any, source: any, shallowArray = false) {
  if (source) {
    if (target === source) {
      return;
    }
    if (isValid(source) && typeof source === 'object') {
      // baseFor
      const iterable = Object(source);
      const props = [];
      // keysIn
      for (const key in iterable) {
        props.push(key);
      }
      let { length } = props;
      let propIndex = -1;
      while (length--) {
        const key = props[++propIndex];
        if (isValid(iterable[key]) && typeof iterable[key] === 'object') {
          baseMergeDeep(target, source, key, shallowArray);
        } else {
          assignMergeValue(target, key, iterable[key]);
        }
      }
    }
  }
}

function baseMergeDeep(target: object, source: object, key: string, shallowArray = false) {
  const objValue = target[key];
  const srcValue = source[key];
  let newValue = source[key];
  let isCommon = true;
  // handle excluded spec keys
  if (directlyAssignSpecKeys.includes(key)) {
    isCommon = false;
  }
  // 不考虑 buffer / typedArray 类型
  else if (isArray(srcValue)) {
    if (shallowArray || !objValue) {
      // 依据参数对数组做浅拷贝
      newValue = [];
    } else if (isArray(objValue)) {
      newValue = objValue;
    } else if (isArrayLike(objValue) && !isString(objValue)) {
      // 如果 objValue 是字符串则直接赋值
      // 如果 source 为数组，则 target 的 arrayLike 对象也视作为数组处理
      newValue = new Array(objValue.length);
      let index = -1;
      const length = objValue.length;
      while (++index < length) {
        newValue[index] = objValue[index];
      }
    }
  }
  // else if (isArray(srcValue) && shallowArray) {
  //   newValue = [];
  // }
  // 不考虑 argument 类型
  else if (isPlainObject(srcValue)) {
    newValue = objValue ?? {};
    // 不考虑 prototype 的额外处理
    if (typeof objValue === 'function' || typeof objValue !== 'object') {
      newValue = {};
    }
  } else {
    isCommon = false;
  }
  // 对 class 等复杂对象或者浅拷贝的 array 不做拷贝处理
  if (isCommon) {
    baseMerge(newValue, srcValue, shallowArray);
  }
  assignMergeValue(target, key, newValue);
}

function assignMergeValue(target: object, key: string, value: any) {
  if ((value !== undefined && !eq(target[key], value)) || (value === undefined && !(key in target))) {
    // 不考虑 __proto__ 的赋值处理
    target[key] = value;
  }
}

function eq(value: any, other: any) {
  return value === other || (Number.isNaN(value) && Number.isNaN(other));
}

export function mergeSpec(target: any, ...sources: any[]): any {
  let sourceIndex = -1;
  const length = sources.length;
  while (++sourceIndex < length) {
    const source = sources[sourceIndex];
    baseMerge(target, source, false);
  }
  return target;
}

export function findChartSpec(s: any, vchartSpec: ISpec) {
  const chartSpec = vchartSpec[s.specKey];
  if (!chartSpec) {
    return null;
  }
  if (isArray(chartSpec)) {
    return chartSpec.find((_s, index) => {
      return isModelInfoMatchSpec(s, _s, s.specKey, index);
    });
  } else if (isObject(chartSpec)) {
    return isModelInfoMatchSpec(s, chartSpec as { id: string | number }, s.specKey, 0) ? chartSpec : null;
  }
  return null;
}
