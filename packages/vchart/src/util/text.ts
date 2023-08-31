import type { ITextMeasureOption } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { TextMeasure } from '@visactor/vutils';
import { getTextBounds } from '@visactor/vrender';
import type { ITextMarkSpec } from '../typings';
import { THEME_CONSTANTS } from '../theme/builtin/common/constants';

export const initTextMeasure = (
  textSpec?: Partial<ITextMarkSpec>,
  option?: Partial<ITextMeasureOption>,
  useNaiveCanvas?: boolean
): TextMeasure<ITextMarkSpec> => {
  return new TextMeasure<ITextMarkSpec>(
    {
      defaultFontParams: {
        fontFamily: THEME_CONSTANTS.defaultFontFamily,
        fontSize: THEME_CONSTANTS.defaultFontSize
      },
      getTextBounds: useNaiveCanvas ? undefined : getTextBounds,
      specialCharSet: '-/: .,@%\'"~' + TextMeasure.ALPHABET_CHAR_SET + TextMeasure.ALPHABET_CHAR_SET.toUpperCase(),
      ...(option ?? {})
    },
    textSpec
  );
};
