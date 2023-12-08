import type { IRectMarkSpec, ISymbolMarkSpec, ITextMarkSpec, StringOrNumber } from '../../../typings';
import type { ILegendCommonSpec, NoVisibleMarkStyle } from '../interface';
type Text = StringOrNumber;
export type TextAttribute = {
    visible?: boolean;
    text?: Text;
    space?: number;
    style?: Omit<NoVisibleMarkStyle<ITextMarkSpec>, 'text'>;
};
export type HandlerTextAttribute = {
    visible?: boolean;
    precision?: number;
    formatter?: (text: Text) => Text;
    space?: number;
    style?: Omit<NoVisibleMarkStyle<ITextMarkSpec>, 'text'>;
};
export type IContinuousLegendSpec = ILegendCommonSpec & {
    field?: string;
    scale?: string;
    defaultSelected?: [number, number];
    slidable?: boolean;
    rail?: {
        width?: number;
        height?: number;
        style?: Omit<NoVisibleMarkStyle<IRectMarkSpec>, 'width' | 'height'>;
    };
    handler?: {
        visible?: boolean;
        style?: NoVisibleMarkStyle<ISymbolMarkSpec>;
    };
    track?: {
        style?: Omit<NoVisibleMarkStyle<IRectMarkSpec>, 'width' | 'height'>;
    };
    startText?: TextAttribute;
    endText?: TextAttribute;
    handlerText?: HandlerTextAttribute;
};
export type IColorLegendSpec = IContinuousLegendSpec & {
    type: 'color';
};
export type ISizeLegendSpec = IContinuousLegendSpec & {
    type: 'size';
    sizeBackground?: Omit<NoVisibleMarkStyle<IRectMarkSpec>, 'visible' | 'width' | 'height'>;
    align?: 'top' | 'bottom' | 'left' | 'right';
};
export type IContinuousLegendTheme = Omit<IContinuousLegendSpec, 'type' | 'field' | 'scale' | 'regionIndex' | 'regionId' | 'seriesIndex' | 'seriesId' | 'id' | 'defaultSelected'>;
export interface IColorLegendTheme {
    horizontal?: IContinuousLegendTheme;
    vertical?: IContinuousLegendTheme;
}
export interface ISizeLegendTheme {
    horizontal?: IContinuousLegendTheme & {
        sizeBackground?: ISizeLegendSpec['sizeBackground'];
    };
    vertical?: IContinuousLegendTheme & {
        sizeBackground?: ISizeLegendSpec['sizeBackground'];
    };
}
export {};
