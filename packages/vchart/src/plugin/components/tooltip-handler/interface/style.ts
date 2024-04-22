import type { TooltipAttributes } from '@visactor/vrender-components';
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
  /** 宽度偏移量 */
  widthOffset?: number;
}

export interface ITooltipAttributes extends TooltipAttributes {
  /** dom tooltip 的高度。由于 canvas tooltip 不支持滚动条，dom tooltip 单独计算高度 */
  panelDomHeight?: number;
  /** dom tooltip 内容区的最大高度，canvas tooltip 不支持 */
  maxContentHeight?: number;
}
