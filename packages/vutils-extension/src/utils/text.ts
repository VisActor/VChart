import type { ITextMeasureOption } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { TextMeasure } from '@visactor/vutils';
import { ITextGraphicAttribute, calculateLineHeight } from '@visactor/vrender-core';
import { getTextBounds } from '@visactor/vrender-core';

export const initTextMeasure = (
  textSpec?: Partial<ITextGraphicAttribute>,
  option?: Partial<ITextMeasureOption>,
  useNaiveCanvas?: boolean,
  defaultFontParams?: Partial<ITextGraphicAttribute>
): TextMeasure<Omit<ITextGraphicAttribute, 'lineHeight'> & { lineHeight?: number }> => {
  return new TextMeasure<Omit<ITextGraphicAttribute, 'lineHeight'> & { lineHeight?: number }>(
    {
      defaultFontParams: {
        fontFamily:
          // eslint-disable-next-line max-len
          'PingFang SC,Helvetica Neue,Microsoft Yahei,system-ui,-apple-system,segoe ui,Roboto,Helvetica,Arial,sans-serif,apple color emoji,segoe ui emoji,segoe ui symbol',
        fontSize: 14,
        ...defaultFontParams
      },
      getTextBounds: useNaiveCanvas ? undefined : getTextBounds,
      specialCharSet: '-/: .,@%\'"~' + TextMeasure.ALPHABET_CHAR_SET + TextMeasure.ALPHABET_CHAR_SET.toUpperCase(),
      ...(option ?? {})
    },
    {
      ...textSpec,
      lineHeight: calculateLineHeight(textSpec?.lineHeight, textSpec?.fontSize)
    }
  );
};
