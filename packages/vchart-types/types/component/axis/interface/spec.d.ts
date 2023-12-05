import type { AxisItem, AxisItemStateStyle } from '@visactor/vrender-components';
import type { IAnimationSpec } from '../../../animation/spec';
import type { Datum, IPadding, IRectMarkSpec, IRuleMarkSpec, ISymbolMarkSpec, ITextMarkSpec, StringOrNumber } from '../../../typings';
import type { IComponentSpec } from '../../base/interface';
import type { AxisType, IAxisItem, ITickCallbackOption, StyleCallback } from './common';
import type { IRichTextCharacter } from '@visactor/vrender-core';
export interface ICommonAxisSpec extends Omit<IComponentSpec, 'orient' | 'center'>, IAnimationSpec<string, string> {
    type?: AxisType;
    visible?: boolean;
    inverse?: boolean;
    tick?: ITick;
    subTick?: ISubTick;
    animation?: boolean;
    select?: boolean;
    hover?: boolean;
    sampling?: boolean;
}
export interface ILinearAxisSpec {
    min?: number;
    max?: number;
    range?: {
        min?: number;
        max?: number;
    };
    nice?: boolean;
    niceType?: 'tickCountFirst' | 'accurateFirst';
    zero?: boolean;
    expand?: {
        min?: number;
        max?: number;
    };
    tooltipFilterRange?: number | [number, number];
}
export interface IBandAxisSpec {
    trimPadding?: boolean;
    bandPadding?: number | number[];
    paddingInner?: number | number[];
    paddingOuter?: number | number[];
    domain?: StringOrNumber[];
    bandPosition?: number;
}
export interface IGrid extends IAxisItem<IRuleMarkSpec> {
    alternateColor?: string | string[];
    alignWithLabel?: boolean;
    style?: IRuleMarkSpec | StyleCallback<IRuleMarkSpec | undefined>;
    zIndex?: number;
}
export interface ITick extends IAxisItem<IRuleMarkSpec> {
    tickSize?: number;
    inside?: boolean;
    alignWithLabel?: boolean;
    tickStep?: number;
    tickCount?: number | ((option: ITickCallbackOption) => number);
    forceTickCount?: number;
    tickMode?: 'average' | 'd3';
    noDecimals?: boolean;
    style?: IRuleMarkSpec | StyleCallback<IRuleMarkSpec | undefined>;
    state?: AxisItemStateStyle<IRuleMarkSpec>;
    dataFilter?: (data: AxisItem[]) => AxisItem[];
}
export interface ISubTick extends IAxisItem<IRuleMarkSpec> {
    tickCount?: number;
    inside?: boolean;
    tickSize?: number;
    state?: AxisItemStateStyle<IRuleMarkSpec>;
}
export interface ILabel extends IAxisItem<ITextMarkSpec> {
    type?: 'text' | 'rich' | 'html';
    formatMethod?: (text: string | string[], datum?: Datum) => string | string[] | IRichTextCharacter[];
    space?: number;
    inside?: boolean;
    minGap?: number;
    style?: ITextMarkSpec | StyleCallback<ITextMarkSpec | undefined>;
    state?: AxisItemStateStyle<ITextMarkSpec>;
    dataFilter?: (data: AxisItem[], layer: number) => AxisItem[];
}
export interface IDomainLine extends IAxisItem<IRuleMarkSpec> {
    state?: AxisItemStateStyle<IRuleMarkSpec>;
}
export interface ITitle extends IAxisItem<ITextMarkSpec> {
    position?: 'start' | 'middle' | 'end';
    space?: number;
    padding?: IPadding | number | number[];
    background?: IAxisItem<IRectMarkSpec> & {
        state?: AxisItemStateStyle<Partial<IRectMarkSpec>>;
    };
    shape?: IAxisItem<ISymbolMarkSpec> & {
        space?: number;
        state?: AxisItemStateStyle<Partial<ISymbolMarkSpec>>;
    };
    type?: 'text' | 'rich' | 'html';
    text?: string | string[] | IRichTextCharacter[];
    angle?: number;
    state?: AxisItemStateStyle<Partial<ITextMarkSpec>>;
}
