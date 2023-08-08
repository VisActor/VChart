import type { ITextMeasureOption } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { TextMeasure, TestTextMeasure } from '@visactor/vutils';
import { getTextBounds } from '@visactor/vrender';
import type { ITextMarkSpec } from '../typings';
import { DEFAULT_TEXT_FONT_FAMILY, DEFAULT_TEXT_FONT_SIZE } from '../theme/builtin/constant';

export const initTextMeasure = (
  textSpec?: Partial<ITextMarkSpec>,
  option?: Partial<ITextMeasureOption>,
  useNaiveCanvas?: boolean
): TextMeasure<ITextMarkSpec> => {
  return new TextMeasure<ITextMarkSpec>(
    {
      defaultFontParams: {
        fontFamily: DEFAULT_TEXT_FONT_FAMILY,
        fontSize: DEFAULT_TEXT_FONT_SIZE
      },
      getTextBounds: useNaiveCanvas ? undefined : getTextBounds,
      specialCharSet: '-/: .,@%\'"~' + TextMeasure.ALPHABET_CHAR_SET + TextMeasure.ALPHABET_CHAR_SET.toUpperCase(),
      ...(option ?? {})
    },
    textSpec
  );
};

/** 测试方法 */
export const testTextMeasure = (textSpec?: Partial<ITextMarkSpec>, useVRender?: boolean): TestTextMeasure<any> => {
  return new TestTextMeasure(
    {
      defaultFontParams: {
        fontFamily: DEFAULT_TEXT_FONT_FAMILY,
        fontSize: DEFAULT_TEXT_FONT_SIZE
      },
      getTextBounds: useVRender ? getTextBounds : undefined
    },
    textSpec
  );
};
