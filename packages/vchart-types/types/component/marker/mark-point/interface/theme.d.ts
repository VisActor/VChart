import type { IImageGraphicAttribute, IRichTextGraphicAttribute, IGroupGraphicAttribute } from '@visactor/vrender-core';
import type { IMarkPointItemPosition } from '@visactor/vrender-components';
import type { ILineMarkSpec, ISymbolMarkSpec } from '../../../../typings';
import type { IMarkerLabelSpec, IMarkerRef, IMarkerState, IMarkerSymbol } from '../../interface';
import type { IRegion } from 'src/region';
export type IOffsetCallback = (region: IRegion) => number;
export interface IItemContent extends IMarkerRef {
    type?: 'symbol' | 'text' | 'image' | 'richText';
    position?: keyof typeof IMarkPointItemPosition;
    offsetX?: number | 'regionRight' | 'regionLeft' | IOffsetCallback;
    offsetY?: number | 'regionTop' | 'regionBottom' | IOffsetCallback;
    confine?: boolean;
    symbol?: Partial<IMarkerState<ISymbolMarkSpec>>;
    image?: Partial<IMarkerState<IImageGraphicAttribute>>;
    text?: IMarkerLabelSpec;
    richText?: Partial<IMarkerState<IRichTextGraphicAttribute>>;
    customMark?: Partial<IMarkerState<IGroupGraphicAttribute>>;
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
    line?: Partial<IMarkerState<Omit<ILineMarkSpec, 'visible'>>>;
};
export interface IMarkPointTheme<T extends Partial<IMarkerSymbol> = Partial<IMarkerSymbol>> {
    itemLine?: IItemLine<T>;
    itemContent?: IItemContent;
}
