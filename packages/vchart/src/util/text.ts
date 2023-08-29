import type { ITextMeasureOption } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { TextMeasure, TestTextMeasure } from '@visactor/vutils';
import type { IRichTextAttribute } from '@visactor/vrender';
// eslint-disable-next-line no-duplicate-imports
import { createRichText, getTextBounds } from '@visactor/vrender';
import type { ITextMarkSpec } from '../typings';
import { DEFAULT_TEXT_FONT_FAMILY, DEFAULT_TEXT_FONT_SIZE } from '../theme';

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

/** 测量富文本 */
// FIXME: 等 vrender 支持后删掉
type IRichTextBoundsParams = Partial<IRichTextAttribute>;
const richText = createRichText({});
export function getRichTextBounds(params: IRichTextBoundsParams) {
  richText.setAttributes(params);
  return richText.AABBBounds;
}
