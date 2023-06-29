import type { ITheme } from '../../../../theme';
// eslint-disable-next-line no-duplicate-imports
import { DEFAULT_TEXT_FONT_FAMILY } from '../../../../theme';
import type { ITooltipTextTheme } from '../../interface';
import type { ITextStyle } from '../interface';

export function getTextAttributes(style: ITooltipTextTheme = {}, globalTheme?: ITheme) {
  const attrs: ITextStyle = {
    fill: style.fontColor,
    textAlign: style.textAlign,
    textBaseline: style.textBaseline,
    fontFamily: style.fontFamily ?? globalTheme?.fontFamily ?? DEFAULT_TEXT_FONT_FAMILY,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    spacing: style.spacing ?? 10
  };
  return attrs;
}
