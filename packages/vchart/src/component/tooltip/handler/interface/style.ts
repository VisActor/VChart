import type { ITextAttribute, IFillStyle, IRectGraphicAttribute, RichTextWordBreak } from '@visactor/vrender';
import type { IPadding } from '../../../../typings';

export interface ITooltipTextStyle extends Partial<ITextAttribute & IFillStyle> {
  /** 和相邻元素的水平间距 */
  spacing: number;
  /** 是否支持换行 */
  multiLine: boolean;
  /** 文本元素的最大宽度 */
  maxWidth?: number;
  /** 换行模式 */
  wordBreak?: RichTextWordBreak;
}

export interface ITooltipPanelStyle extends Partial<IRectGraphicAttribute> {
  shadow: boolean;
  shadowSpread?: number;
}

export interface ITooltipStyle {
  panel: ITooltipPanelStyle;
  title: ITooltipTextStyle;
  shape: {
    fill: boolean;
    size: number;
    spacing: number;
  };
  key: ITooltipTextStyle;
  value: ITooltipTextStyle;
  padding: IPadding;
  spaceRow: number;
  enterable: boolean;
  transitionDuration: number;
}
