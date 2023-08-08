import type { FontWeight, TextAlign } from '../../../../typings/visual';

export interface IDomTooltipStyle {
  panel: IPadding &
    IBorder & {
      width?: string;
      height?: string;
      minHeight?: string;
      backgroundColor?: string;
      boxShadow?: string;
      pointerEvents?: 'auto' | 'none';
      transitionDuration?: string;
      transitionProperty?: string;
      transitionTimingFunction?: string;
    };
  title: ILabelStyle;
  content: IMargin;
  shapeColumn: IMargin & {
    width?: string;
    item?: IShapeStyle;
  };
  keyColumn: IMargin & {
    width?: string;
    item?: ILabelStyle;
  };
  valueColumn: IMargin & {
    width?: string;
    item?: ILabelStyle;
  };
  spaceRow: string;
}

export interface ILabelStyle extends IMargin {
  fontFamily?: string;
  fontSize?: string;
  color?: string;
  textAlign?: TextAlign;
  lineHeight?: string;
  fontWeight?: FontWeight;
  whiteSpace?: string;
  wordBreak?: string;
  maxWidth?: string;
}

export interface IShapeStyle extends IMargin {
  width?: string;
  height?: string;
}

export interface IMargin {
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  marginBottom?: string;
}

export interface IPadding {
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
}

export interface IBorder {
  borderColor?: string;
  borderWidth?: string;
  borderRadius?: string;
}
