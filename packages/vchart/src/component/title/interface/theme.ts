import type { StringOrNumber } from '../../../typings';
import type { TextAlign, TextBaseLine } from '../../../typings/visual';
export interface ITitleTextTheme {
  /** 主（副）标题宽度 */
  width?: number;
  /** 主（副）标题高度 */
  height?: number;
  /** 字体 */
  fontFamily?: string;
  /** 字体大小 */
  fontSize?: number;
  /** 字体颜色 */
  fontColor?: string;
  /** 字重 */
  fontWeight?: StringOrNumber;
  /** 对齐方式 */
  textAlign?: TextAlign;
  /** 字体基线 */
  textBaseline?: TextBaseLine;
  /** 行高 */
  lineHeight?: number;
}

export interface ITitleTheme {
  /** 主标题样式 */
  textStyle: ITitleTextTheme;
  /** 副标题样式 */
  subtextStyle: ITitleTextTheme;
}
