import type { RichTextWordBreak } from '@visactor/vrender';
import type { StringOrNumber, TextAlign, TextBaseLine } from '../../../typings';
import type { IColorKey } from '../../../theme/color-scheme/interface';
import type { Padding } from '@visactor/vrender-components/es/core/type';

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
  lineHeight?: number | string;
  /** 与相邻元素的水平间距 */
  spacing?: number;
  /** 是否支持换行 */
  multiLine?: boolean;
  /** 最大宽度 */
  maxWidth?: number;
  /** 换行模式，默认为'break-word' */
  wordBreak?: RichTextWordBreak;
  /**
   * 是否开启自动宽度。效果分为以下几种情况：
   * - tooltip 标题：`autoWidth` 默认为 `false`。如果配置为 `true`，则 tooltip 标题会保持和 tooltip 内容一致的宽度
   * - tooltip key 标签：`autoWidth` 不适用
   * - tooltip value 标签：`autoWidth` 默认为 `true`。如果配置为 `true`，则 tooltip value 标签会自动占满 tooltip 整体宽度的剩余部分
   * @since 1.4.2
   */
  autoWidth?: boolean;
}

export interface ITooltipTheme {
  /** 容器样式配置 */
  panel?: {
    /** tooltip 容器内边距 */
    padding?: Padding;
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
  keyLabel?: Omit<ITooltipTextTheme, 'autoWidth'>;
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
