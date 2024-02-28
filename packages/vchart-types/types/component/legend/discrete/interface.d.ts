import type { IRectMarkSpec, ISymbolMarkSpec, ITextMarkSpec } from '../../../typings/visual';
import type { DiscreteLegendAttrs, LegendItemDatum, LegendItem } from '@visactor/vrender-components';
import type { ILegendCommonSpec, NoVisibleMarkStyle } from '../interface';
import type { StringOrNumber } from '../../../typings';
import type { IBaseScale } from '@visactor/vscale';
import type { IGlobalScale } from '../../../scale/interface';
export type formatterCallback = (text: StringOrNumber, item: LegendItemDatum, index: number) => any;
export type LegendItemStyleValue<T> = T | ((item: LegendItemDatum, isSelected: boolean, index: number, allItems: LegendItemDatum[]) => T);
export type LegendItemStyle<T> = {
    style?: T;
    state?: {
        selected?: T;
        unSelected?: T;
        selectedHover?: T;
        unSelectedHover?: T;
    };
};
export type IItem = {
    background?: {
        visible?: boolean;
    } & LegendItemStyle<LegendItemStyleValue<NoVisibleMarkStyle<IRectMarkSpec>>>;
    shape?: {
        visible?: boolean;
        space?: number;
    } & LegendItemStyle<LegendItemStyleValue<Partial<NoVisibleMarkStyle<ISymbolMarkSpec>>>>;
    label?: {
        space?: number;
        formatMethod?: formatterCallback;
    } & LegendItemStyle<LegendItemStyleValue<NoVisibleMarkStyle<ITextMarkSpec>>>;
    value?: {
        space?: number;
        alignRight?: boolean;
        formatMethod?: formatterCallback;
    } & LegendItemStyle<LegendItemStyleValue<NoVisibleMarkStyle<ITextMarkSpec>>>;
    focusIconStyle?: NoVisibleMarkStyle<ISymbolMarkSpec>;
    maxWidth?: number | string;
    width?: number | string;
    height?: number | string;
} & Omit<LegendItem, 'background' | 'shape' | 'label' | 'value' | 'focusIconStyle' | 'width' | 'height' | 'maxWidth'>;
export type IPager = {
    textStyle?: Partial<NoVisibleMarkStyle<ITextMarkSpec>>;
    handler?: {
        space?: number;
        preShape?: string;
        nextShape?: string;
        style?: Omit<NoVisibleMarkStyle<ISymbolMarkSpec>, 'symbolType'>;
        state?: {
            hover?: Omit<NoVisibleMarkStyle<ISymbolMarkSpec>, 'symbolType'>;
            disable?: Omit<NoVisibleMarkStyle<ISymbolMarkSpec>, 'symbolType'>;
        };
    };
} & Omit<DiscreteLegendAttrs['pager'], 'textStyle' | 'handler'>;
export type IDiscreteLegendSpec = ILegendCommonSpec & {
    type?: 'discrete';
    data?: (data: LegendItemDatum[], colorScale: IBaseScale, globalScale: IGlobalScale) => LegendItemDatum[];
    item?: IItem;
    pager?: IPager;
    scaleName?: string;
    field?: string;
    defaultSelected?: string[];
} & Omit<DiscreteLegendAttrs, 'layout' | 'title' | 'items' | 'item' | 'pager'>;
export type IDiscreteLegendTheme = Omit<IDiscreteLegendSpec, 'type' | 'data' | 'regionIndex' | 'regionId' | 'seriesIndex' | 'seriesId' | 'id' | 'defaultSelected'>;
