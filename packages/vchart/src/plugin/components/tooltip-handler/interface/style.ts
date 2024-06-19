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
}

export interface ITooltipAttributes extends TooltipAttributes {
  /** dom tooltip 的高度。由于 canvas tooltip 不支持滚动条，dom tooltip 单独计算高度 */
  panelDomHeight?: number;
  /** dom tooltip 内容区的最大高度，canvas tooltip 不支持 */
  maxContentHeight?: number;
  /**
   * @since 1.11.5
   *
   * shape、key、value的对齐方式，可选项如下：
   * 'left': 从左到右对齐
   * 'right': 从右到左对齐
   */
  align?: 'left' | 'right';
}
