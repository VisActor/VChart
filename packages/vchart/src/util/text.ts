import type { ITextMeasureOption, ITextSize } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import type { TextMeasure } from '@visactor/vutils';
import { initTextMeasure as initTextMeasureFunc } from '@visactor/vutils-extension';
import type { ITextGraphicAttribute } from '@visactor/vrender-core';
import { tokenMap } from '../theme/token';

export const initTextMeasure = (
  textSpec?: Partial<ITextGraphicAttribute>,
  option?: Partial<ITextMeasureOption>,
  useNaiveCanvas?: boolean
): TextMeasure<ITextGraphicAttribute> => {
  return initTextMeasureFunc(textSpec, option, useNaiveCanvas, {
    fontFamily: tokenMap.defaultFontFamily,
    fontSize: tokenMap.defaultFontSize
  });
};

export const measureText = (
  text: string,
  textSpec?: Partial<ITextGraphicAttribute>,
  option?: Partial<ITextMeasureOption>,
  useNaiveCanvas?: boolean
): ITextSize => {
  return initTextMeasure(textSpec, option, useNaiveCanvas).measure(text);
};
