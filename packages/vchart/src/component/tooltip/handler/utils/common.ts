import type { TooltipContentCallback } from '../../../../typings';
import { isFunction, isObject, isString, isNil } from '../../../../util';

interface IGradientColor {
  [key: string]: any;
  stops: {
    offset: number;
    color: string;
  }[];
}

/**
 * Escape special HTML characters.
 *
 * @param value A value to convert to string and HTML-escape.
 */
export function escapeHTML(value: any): string {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\(/g, '&#40;');
}

export const getTooltipValue = (
  field: string | TooltipContentCallback | null | undefined,
  datum?: any
): string | undefined => {
  if (isNil(field)) {
    return null;
  }
  if (isFunction(field)) {
    return field(datum);
  }
  return field.toString();
};

export function pickFirstValidValue<T>(isValid: (element?: T) => any, ...elements: T[]): T | undefined {
  for (const ele of elements) {
    if (isValid(ele)) {
      return ele;
    }
  }
  return undefined;
}

// 针对渐变色，受底层渲染引擎影响，不一定都能绘制正确，所以这里取 colorStop 的第一个颜色作为 color
export function convertToColorString(color: any, defaultColor: string = '#000') {
  if (!color) {
    return defaultColor;
  }
  if (isString(color)) {
    return color;
  }

  if (isObject(color) && (color as IGradientColor).stops && (color as IGradientColor).stops[0]) {
    return (color as IGradientColor).stops[0].color || defaultColor;
  }

  return defaultColor;
}
