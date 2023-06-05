import type { ITextAttribute, IFillStyle, IRectGraphicAttribute } from '@visactor/vrender';
import type { IPadding } from '../../../../typings';

export interface ITextStyle extends Partial<ITextAttribute & IFillStyle> {
  spacing: number;
}

export interface IPanelStyle extends Partial<IRectGraphicAttribute> {
  shadow: boolean;
  shadowSpread?: number;
}

export interface ITooltipStyle {
  panel: IPanelStyle;
  title: ITextStyle;
  shape: {
    fill: boolean;
    size: number;
    spacing: number;
  };
  key: ITextStyle;
  value: ITextStyle;
  padding: IPadding;
  minWidth: number;
  maxWidth: number;
  spaceRow: number;
  enterable: boolean;
  transitionDuration: number;
}
