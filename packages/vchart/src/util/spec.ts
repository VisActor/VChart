import { isArray, isBoolean, isDate, isNumber, isString, isValid } from '@visactor/vutils';
import { DataView } from '@visactor/vdataset';

// todo 以目前的场景来看，并没有递归的需要。
// 考虑到不确定性，还是递归处理spec对象，时间消耗很少
export function specTransform(
  spec: unknown,
  special: {
    [key: string]: (v: unknown) => unknown;
  } = {
    data: v => v
  }
): unknown {
  if (!spec) {
    return spec;
  }
  // 如果是普通对象
  if (spec.constructor === Object) {
    const result: any = {};
    for (const key in spec as any) {
      if (Object.prototype.hasOwnProperty.call(spec, key)) {
        // todo 特殊处理怎样更合理?
        if (special[key]) {
          result[key] = special[key](spec[key]);
          continue;
        }
        result[key] = specTransform(spec[key], special);
      }
    }
    return result;
  }
  // 如果是数组
  if (isArray(spec)) {
    return spec.map(s => specTransform(s, special));
  }
  return spec;
}

/**
 * 深拷贝 spec，为避免循环引用，DataView 维持原有引用
 * @param spec 原spec
 */
export function cloneDeepSpec(spec: any) {
  const value = spec;

  let result;
  if (!isValid(value) || typeof value !== 'object') {
    return value;
  }

  // 判断是不是 DataView 对象
  if (isDataView(value)) {
    return value;
  }

  const isArr = isArray(value);
  const length = value.length;
  // 不考虑特殊数组的额外处理
  if (isArr) {
    result = new Array(length);
  }
  // 不考虑 buffer / arguments 类型的处理以及 prototype 的额外处理
  else if (typeof value === 'object') {
    result = {};
  }
  // 不建议使用作为 Boolean / Number / String 作为构造器
  else if (isBoolean(value) || isNumber(value) || isString(value)) {
    result = value;
  } else if (isDate(value)) {
    result = new Date(+value);
  }
  // 不考虑 ArrayBuffer / DataView / TypedArray / map / set / regexp / symbol 类型
  else {
    result = undefined;
  }

  // 不考虑 map / set / TypedArray 类型的赋值

  // 不考虑对象的 symbol 属性
  const props = isArr ? undefined : Object.keys(Object(value));

  let index = -1;
  if (result) {
    while (++index < (props || value).length) {
      const key = props ? props[index] : index;
      const subValue = value[key];
      result[key] = cloneDeepSpec(subValue);
    }
  }
  return result;
}

export function isDataView(obj: any): obj is DataView {
  const dataViewKeys: (keyof DataView)[] = ['dataSet', 'latestData', 'rawData', 'parserData', 'isDataView', 'history'];
  const keys = Object.keys(obj);
  return obj instanceof DataView || dataViewKeys.every(key => keys.includes(key));
}
