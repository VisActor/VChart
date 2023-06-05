import type { ITooltipTextTheme } from '../../interface';
import type { ITextStyle } from '../interface';

export function getTextAttributes(style: ITooltipTextTheme = {}) {
  const attrs: ITextStyle = {
    fill: true,
    fillColor: style.fontColor,
    textAlign: style.textAlign,
    textBaseline: style.textBaseline,
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    spacing: style.spacing
  };
  return attrs;
}
