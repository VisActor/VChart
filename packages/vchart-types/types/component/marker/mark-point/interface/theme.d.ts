import type { IImageGraphicAttribute, IRichTextGraphicAttribute } from '@visactor/vrender-core';
import type { IMarkPointItemPosition } from '@visactor/vrender-components';
import type { ILineMarkSpec, ISymbolMarkSpec } from '../../../../typings';
import type { IMarkerLabelSpec, IMarkerRef, IMarkerSymbol } from '../../interface';
export interface IItemContent extends IMarkerRef {
    type?: 'symbol' | 'text' | 'image' | 'richText';
    position?: IMarkPointItemPosition;
    offsetX?: number;
    offsetY?: number;
    symbol?: {
        style?: ISymbolMarkSpec;
    };
    image?: {
        style?: IImageGraphicAttribute;
    };
    text?: IMarkerLabelSpec;
    richText?: {
        style?: IRichTextGraphicAttribute;
    };
}
export type IItemLine<T extends Partial<IMarkerSymbol> = IMarkerSymbol> = {
    type?: 'type-s' | 'type-do' | 'type-po' | 'type-op';
    visible?: boolean;
    decorativeLine?: {
        visible?: boolean;
        length?: number;
    };
    startSymbol?: T;
    endSymbol?: T;
    line?: {
        style?: Omit<ILineMarkSpec, 'visible'>;
    };
};
export interface IMarkPointTheme<T extends Partial<IMarkerSymbol> = Partial<IMarkerSymbol>> {
    itemLine?: IItemLine<T>;
    itemContent?: IItemContent;
}
