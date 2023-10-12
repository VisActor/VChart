import type { ITextAttribute, IFillStyle, RichTextWordBreak } from '@visactor/vrender-core';

export interface ITooltipTextStyle extends Partial<ITextAttribute & IFillStyle> {
  /** 和相邻元素的水平间距 */
  spacing?: number;
  /** 是否支持换行 */
  multiLine?: boolean;
  /** 文本元素的最大宽度 */
  maxWidth?: number;
  /** 换行模式 */
  wordBreak?: RichTextWordBreak;
  /** 是否开启自动宽度 */
  autoWidth?: boolean;
}
