import type { Datum } from '@visactor/vgrammar-core';
import type { MaybeArray, TooltipContentProperty, TooltipData, TooltipPatternProperty } from '../../../../typings';
import { isFunction, isObject, isString, isNil, isArray, isValid } from '@visactor/vutils';
import type { TooltipHandlerParams } from '../../interface';
import type { IDimensionData, IDimensionInfo } from '../../../../event/events/dimension';
import type { IRichTextParagraphCharacter } from '@visactor/vrender-core';
// eslint-disable-next-line no-duplicate-imports
import { getRichTextBounds } from '@visactor/vrender-core';
import type { ITooltipTextStyle } from '../interface/style';
import type { TooltipRichTextAttrs } from '@visactor/vrender-components';
import type { IRichTextCharacter } from '@visactor/vrender-core';

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
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\(/g, '&#40;')
    .replace(/  /g, ' &nbsp;'); // 转义符和真空格夹杂，在转义和正常换行之间取得平衡
}

export const getTooltipContentValue = <T>(
  field?: TooltipContentProperty<T>,
  datum?: any,
  params?: TooltipHandlerParams
): T | undefined => {
  if (isNil(field)) {
    return field;
  }
  if (isFunction(field)) {
    return field(datum, params);
  }
  return field;
};

export const getTooltipPatternValue = <T>(
  field?: MaybeArray<TooltipPatternProperty<T>>,
  data?: TooltipData,
  params?: TooltipHandlerParams
): (typeof field extends Array<TooltipPatternProperty<T>> ? MaybeArray<T> : T) | undefined => {
  if (isNil(field)) {
    return field;
  }
  if (isArray(field)) {
    const result: T[] = [];
    field.forEach(item => {
      if (isFunction(item)) {
        const value = item(data, params);
        if (isValid(value)) {
          result.push(value);
        }
      } else {
        result.push(item);
      }
    });
    return result as any;
  }
  if (isFunction(field)) {
    return field(data, params);
  }
  return field;
};

export function getFirstDatumFromTooltipData(data: TooltipData): Datum {
  // 找到第一个可用的datum
  const dimInfoList: IDimensionInfo[] = (data as IDimensionData[])[0]?.series
    ? [{ data: data as IDimensionData[], value: '' }]
    : (data as IDimensionInfo[]);
  for (const { data: dataList } of dimInfoList) {
    for (const { datum: datumList } of dataList) {
      for (const datumItem of datumList ?? []) {
        if (datumItem) {
          return datumItem;
        }
      }
    }
  }
}

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

/** 获取元素的绝对缩放因数（支持外部传入 boundingClientRect 提升性能） */
export const getScale = (element: HTMLElement, boundingClientRect?: DOMRect) => {
  if (!element) {
    return 1;
  }
  if (!boundingClientRect) {
    boundingClientRect = element.getBoundingClientRect();
  }
  if (element.offsetWidth > 0) {
    return boundingClientRect.width / element.offsetWidth;
  }
  return boundingClientRect.height / element.offsetHeight;
};

interface ITooltipTextInfo {
  width: number;
  height: number;
  text: MaybeArray<number> | MaybeArray<string> | TooltipRichTextAttrs;
}

/** 测量 tooltip 标签文本 */
export const measureTooltipText = (text: string | TooltipRichTextAttrs, style: ITooltipTextStyle): ITooltipTextInfo => {
  let textLines: string[] | TooltipRichTextAttrs;
  let textConfig: IRichTextCharacter[];
  if (!((text as TooltipRichTextAttrs)?.type === 'rich' || (text as TooltipRichTextAttrs)?.type === 'html')) {
    text = (text ?? '').toString();
    if (style.multiLine) {
      textLines = text.split('\n');
      textLines = textLines.map((line, i) => (i < (textLines as string[]).length - 1 ? line + '\n' : line));
    } else {
      textLines = [text];
    }
    textConfig = textLines.map(
      line =>
        ({
          ...style,
          text: line
        } as unknown as IRichTextParagraphCharacter)
    );
  } else {
    textConfig = (text as TooltipRichTextAttrs).text as IRichTextCharacter[];
    textLines = text as TooltipRichTextAttrs;
  }

  const bound = getRichTextBounds({
    wordBreak: style.wordBreak ?? 'break-word',
    maxWidth: style.maxWidth ? style.maxWidth : undefined,
    width: 0,
    height: 0,
    textConfig: textConfig
  });
  return {
    width: bound.width(),
    height: bound.height(),
    text: textLines
  };
};
