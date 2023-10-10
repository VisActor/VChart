import type { RichTextWordBreak } from '@visactor/vrender-core';
import type { IPadding, StringOrNumber, TextAlign, TextBaseLine } from '../../../typings';
import type { IColorKey } from '../../../theme/color-scheme/interface';
export interface ITooltipTextTheme {
  fontFamily?: string;
  fontSize?: number;
  fill?: string | IColorKey;
  fontColor?: string | IColorKey;
  fontWeight?: StringOrNumber;
  textAlign?: TextAlign;
  textBaseline?: TextBaseLine;
  lineHeight?: number | string;
  spacing?: number;
  multiLine?: boolean;
  maxWidth?: number;
  wordBreak?: RichTextWordBreak;
}
export interface ITooltipTheme {
  panel?: {
    padding?: IPadding;
    backgroundColor?: string | IColorKey;
    border?: {
      color?: string | IColorKey;
      width?: number;
      radius?: number;
    };
    shadow?: {
      x: number;
      y: number;
      blur: number;
      spread: number;
      color: string | IColorKey;
    };
  };
  shape?: {
    size?: number;
    spacing?: number;
  };
  titleLabel?: ITooltipTextTheme;
  keyLabel?: ITooltipTextTheme;
  valueLabel?: ITooltipTextTheme;
  spaceRow?: number;
  offset?: {
    x?: number;
    y?: number;
  };
}
