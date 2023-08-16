import type { ITheme } from '../../../../theme';
// eslint-disable-next-line no-duplicate-imports
import { DEFAULT_TEXT_FONT_FAMILY } from '../../../../theme';
import type { ITooltipTextTheme } from '../../interface';
import type { ITooltipTextStyle } from '../interface';

const defaultTextAttributes: Partial<ITooltipTextStyle> = {
  fontFamily: DEFAULT_TEXT_FONT_FAMILY,
  spacing: 10,
  multiLine: false,
  wordBreak: 'break-word'
};

export function getTextAttributes(
  style: ITooltipTextTheme = {},
  globalTheme?: ITheme,
  defaultAttributes?: Partial<ITooltipTextStyle>
): ITooltipTextStyle {
  const attrs: ITooltipTextStyle = {
    ...(defaultAttributes ?? defaultTextAttributes),
    fill: style.fill ?? style.fontColor,
    textAlign: style.textAlign,
    textBaseline: style.textBaseline,
    fontFamily: style.fontFamily ?? globalTheme?.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    spacing: style.spacing,
    multiLine: style.multiLine,
    maxWidth: style.maxWidth,
    wordBreak: style.wordBreak
  };
  return attrs;
}
