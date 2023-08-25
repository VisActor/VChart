import type { IBackgroundSpec, IBackgroundStyleSpec } from './../typings/spec/common';
import type { Maybe } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import {
  array,
  isArray,
  isBoolean,
  isDate,
  isFunction,
  isNumber,
  isObject,
  isString,
  isValid,
  merge
} from '@visactor/vutils';
import { DataView } from '@visactor/vdataset';
import { getActualColor, isColorKey, transformColorSchemeToStandardStruct } from '../theme/color-scheme/util';
import type { IThemeColorScheme } from '../theme/color-scheme/interface';
import type { ISeriesMarkInfo, ISeriesTheme, SeriesTypeEnum } from '../series/interface';
// eslint-disable-next-line no-duplicate-imports
import { seriesMarkInfoMap } from '../series/interface';
import type { ITheme } from '../theme';

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

  // 判断是不是不能深拷贝的对象
  if (isDataView(value) || isHTMLElement(value)) {
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
  return obj instanceof DataView;
}

export function isHTMLElement(obj: any): obj is Element {
  try {
    return obj instanceof Element;
  } catch {
    // 跨端 plan B
    const htmlElementKeys: (keyof Element)[] = [
      'children',
      'innerHTML',
      'classList',
      'setAttribute',
      'tagName',
      'getBoundingClientRect'
    ];
    const keys = Object.keys(obj);
    return htmlElementKeys.every(key => keys.includes(key));
  }
}

export function convertBackgroundSpec(
  bg: IBackgroundSpec
): Omit<IBackgroundStyleSpec, 'image'> & { background?: IBackgroundStyleSpec['image'] } {
  if (!bg) {
    return null;
  }
  if (typeof bg === 'string') {
    return {
      fill: bg,
      fillOpacity: 1
    };
  }
  if (typeof bg !== 'object') {
    return null;
  }
  const { x, y, width, height, x1, y1, image, ...rest } = bg;
  rest.background = image;
  return rest;
}

/** 对 spec 或者类 spec 配置（如 theme）进行预处理，如进行语义化颜色的转换 */
export function preprocessSpecOrTheme(obj: any, colorScheme?: IThemeColorScheme, seriesType?: SeriesTypeEnum): any {
  if (isArray(obj)) {
    return obj.map(element => {
      if (isObject(element) && !isFunction(element)) {
        return preprocessSpecOrTheme(element, colorScheme, seriesType);
      }
      return element;
    });
  }

  const newObj = { ...obj };
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    // 绕过数据
    if (key.includes('data')) {
      newObj[key] = value;
      return;
    }
    if (isObject(value)) {
      // 绕过不可深拷贝的对象
      if (isFunction(value) || isDataView(value) || isHTMLElement(value)) {
        newObj[key] = value;
        return;
      }
      // 查询、替换语义化颜色
      if (isColorKey(value)) {
        newObj[key] = getActualColor(value, colorScheme, seriesType);
      } else {
        newObj[key] = preprocessSpecOrTheme(value, colorScheme, seriesType);
      }
    } else {
      newObj[key] = value;
    }
  });

  return newObj;
}

export function mergeTheme(target: Maybe<ITheme>, ...sources: Maybe<ITheme>[]): Maybe<ITheme> {
  return merge(preprocessThemeToMerge(target), ...sources.map(preprocessThemeToMerge));
}

function preprocessThemeToMerge(theme?: Maybe<ITheme>): Maybe<ITheme> {
  if (!theme) {
    return theme;
  }

  // 将色板转化为标准形式
  let { colorScheme } = theme;
  if (colorScheme) {
    colorScheme = Object.keys(colorScheme).reduce<IThemeColorScheme>((scheme, key) => {
      const value = colorScheme[key];
      scheme[key] = transformColorSchemeToStandardStruct(value);
      return scheme;
    }, {} as IThemeColorScheme);
  }

  // 将全局 mark 主题 merge 进系列主题
  let { series } = theme;
  const { mark: markByType, markByName } = theme;
  if (markByType || markByName) {
    series = Object.keys(seriesMarkInfoMap).reduce((newSeriesTheme, key) => {
      const value = series?.[key] ?? {};
      const newValue = {};
      Object.values<ISeriesMarkInfo>(seriesMarkInfoMap[key]).forEach(({ type, name }) => {
        newValue[name] = merge({}, markByType?.[array(type)[0]] ?? {}, markByName?.[name] ?? {}, value[name]);
      });
      newSeriesTheme[key] = {
        ...value,
        ...newValue
      };
      return newSeriesTheme;
    }, {} as ISeriesTheme);
  }

  return {
    ...theme,
    colorScheme,
    series
  };
}
