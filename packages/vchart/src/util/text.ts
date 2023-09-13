import type { ITextMeasureOption } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import type { TextMeasure } from '@visactor/vutils';
import type { AdaptiveSpec } from '../typings';
import { THEME_CONSTANTS } from '../theme/builtin/common/constants';
import { initTextMeasure as initTextMeasureFunc } from '@visactor/vutils-extension';
import type { ITextGraphicAttribute } from '@visactor/vrender';

export const initTextMeasure = (
  textSpec?: Partial<ITextGraphicAttribute>,
  option?: Partial<ITextMeasureOption>,
  useNaiveCanvas?: boolean
): TextMeasure<AdaptiveSpec<ITextGraphicAttribute, 'lineHeight'>> => {
  // FIXME: vrender 支持行高字符串后删除 AdaptiveSpec 范型
  return initTextMeasureFunc(textSpec, option, useNaiveCanvas, {
    fontFamily: THEME_CONSTANTS.defaultFontFamily,
    fontSize: THEME_CONSTANTS.defaultFontSize
  });
};
