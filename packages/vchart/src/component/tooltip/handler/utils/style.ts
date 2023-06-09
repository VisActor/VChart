import { DEFAULT_TEXT_FONT_FAMILY } from '../../../../theme';
import type { ITooltipTextTheme } from '../../interface';
import type { ITextStyle } from '../interface';

export function getTextAttributes(style: ITooltipTextTheme = {}, fontFamily: string) {
  const attrs: ITextStyle = {
    fill: style.fontColor,
    textAlign: style.textAlign,
    textBaseline: style.textBaseline,
    fontFamily: style.fontFamily ?? fontFamily ?? DEFAULT_TEXT_FONT_FAMILY,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    spacing: style.spacing
  };
  return attrs;
}
