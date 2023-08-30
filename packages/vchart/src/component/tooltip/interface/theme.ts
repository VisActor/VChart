import type { RichTextWordBreak } from '@visactor/vrender';
import type { IPadding, StringOrNumber, TextAlign, TextBaseLine } from '../../../typings';
import type { IColorKey } from '../../../theme/color-scheme/interface';

export interface ITooltipTextTheme {
  /** 字体 */
  fontFamily?: string;
  /** 字体大小 */
  fontSize?: number;
  /** 字体颜色 */
  fill?: string | IColorKey;
  /** @deprecated 字体颜色（兼容旧版本） */
  fontColor?: string | IColorKey;
  /** 字重 */
  fontWeight?: StringOrNumber;
  /** 对齐方式 */
  textAlign?: TextAlign;
  /** 字体基线 */
  textBaseline?: TextBaseLine;
  /** 行高 */
  lineHeight?: number;
  /** 与相邻元素的水平间距 */
  spacing?: number;
  /** 是否支持换行 */
  multiLine?: boolean;
  /** 最大宽度 */
  maxWidth?: number;
  /** 换行模式，默认为'break-word' */
  wordBreak?: RichTextWordBreak;
}

export interface ITooltipTheme {
  /** 容器样式配置 */
  panel?: {
    /** tooltip 容器内边距 */
    padding?: IPadding;
    /** 背景色 */
    backgroundColor?: string | IColorKey;
    /** tooltip边框 */
    border?: {
      color?: string | IColorKey;
      width?: number;
      /** 圆角 */
      radius?: number;
    };
    /** tooltip阴影 */
    shadow?: {
      x: number;
      y: number;
      blur: number;
      spread: number;
      color: string | IColorKey;
    };
  };
  shape?: {
    /** 标记大小 */
    size?: number;
    /** shape 与相邻元素的水平间距 */
    spacing?: number;
  };
  /** tooltip标题 */
  titleLabel?: ITooltipTextTheme;
  /** tooltip内容，key字段 */
  keyLabel?: ITooltipTextTheme;
  /** tooltip内容，value字段 */
  valueLabel?: ITooltipTextTheme;
  /** 内容项行间距 */
  spaceRow?: number;
  /** 偏移量 */
  offset?: {
    x?: number;
    y?: number;
  };
}
