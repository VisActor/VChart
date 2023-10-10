import type { ITextAttribute, IFillStyle, IRectGraphicAttribute, RichTextWordBreak } from '@visactor/vrender-core';
import type { IPadding } from '../../../../typings';
export interface ITooltipTextStyle extends Partial<ITextAttribute & IFillStyle> {
  spacing: number;
  multiLine: boolean;
  maxWidth?: number;
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
