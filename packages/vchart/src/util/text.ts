import type { ITextMeasureOption, ITextSize } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import type { TextMeasure } from '@visactor/vutils';
import { THEME_CONSTANTS } from '../theme/builtin/common/constants';
import { initTextMeasure as initTextMeasureFunc } from '@visactor/vutils-extension';
import type { ITextGraphicAttribute } from '@visactor/vrender-core';

export const initTextMeasure = (
  textSpec?: Partial<ITextGraphicAttribute>,
  option?: Partial<ITextMeasureOption>,
  useNaiveCanvas?: boolean
  // TODO 类型完善
  // @ts-ignore
): TextMeasure<ITextGraphicAttribute> => {
  return initTextMeasureFunc(textSpec, option, useNaiveCanvas, {
    fontFamily: THEME_CONSTANTS.defaultFontFamily,
    fontSize: THEME_CONSTANTS.defaultFontSize
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
