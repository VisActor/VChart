import type { ITheme } from '../../../../theme';
import { THEME_CONSTANTS } from '../../../../theme/builtin/common/constants';
import type { ITooltipTextTheme } from '../../interface';
import type { ITooltipTextStyle } from '../interface';

const defaultTextAttributes: Partial<ITooltipTextStyle> = {
  fontFamily: THEME_CONSTANTS.defaultFontFamily,
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
    fill: (style.fill ?? style.fontColor) as string,
    textAlign: style.textAlign,
    textBaseline: style.textBaseline,
    fontFamily: style.fontFamily ?? globalTheme?.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight as any, // FIXME: vrender 支持行高字符串后删除 any
    spacing: style.spacing,
    multiLine: style.multiLine,
    maxWidth: style.maxWidth,
    wordBreak: style.wordBreak
  };
  return attrs;
}
