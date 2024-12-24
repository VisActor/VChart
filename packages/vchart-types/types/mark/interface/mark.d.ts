import type { IMarkSpec } from '../../typings';
import type { IArc3dMarkSpec, IArcMarkSpec, IAreaMarkSpec, IBoxPlotMarkSpec, ICellMarkSpec, ICommonSpec, IComposedTextMarkSpec, IGroupMarkSpec, IImageMarkSpec, ILineMarkSpec, ILinkPathMarkSpec, IPathMarkSpec, IPolygonMarkSpec, IPyramid3dMarkSpec, IRect3dMarkSpec, IRectMarkSpec, IRippleMarkSpec, IRuleMarkSpec, ISymbolMarkSpec } from '../../typings/visual';
import type { IMark, IMarkRaw } from './common';
import type { MarkType } from './type';
export type IComponentMark = IMarkRaw<ICommonSpec>;
export interface ILabelMark extends ITextMark {
    skipEncode: boolean;
    getRule: () => string;
    setRule: (rule: string) => void;
    getTarget: () => IMark;
    setTarget: (target: IMark) => void;
    getComponent: () => IComponentMark;
    setComponent: (component: IComponentMark) => void;
}
export type ITextMark = IMarkRaw<IComposedTextMarkSpec> & {
    getTextType: () => 'text' | 'rich';
};
export type ITextSpec<T> = IMarkSpec<T> & {
    textType?: 'rich' | 'text';
};
export type IArc3dMark = IMarkRaw<IArc3dMarkSpec>;
export type IPolygonMark = IMarkRaw<IPolygonMarkSpec>;
export type IPyramid3dMark = IMarkRaw<IPyramid3dMarkSpec>;
export type IArcMark = IMarkRaw<IArcMarkSpec>;
export type IAreaMark = IMarkRaw<IAreaMarkSpec>;
export type IBoxPlotMark = IMarkRaw<IBoxPlotMarkSpec>;
export type ICellMark = IMarkRaw<ICellMarkSpec>;
export type IImageMark = IMarkRaw<IImageMarkSpec>;
export type ILineMark = IMarkRaw<ILineMarkSpec>;
export type ILinkPathMark = IMarkRaw<ILinkPathMarkSpec>;
export type IPathMark = IMarkRaw<IPathMarkSpec>;
export type IRect3dMark = IMarkRaw<IRect3dMarkSpec>;
export type IRectMark = IMarkRaw<IRectMarkSpec>;
export type IRippleMark = IMarkRaw<IRippleMarkSpec>;
export type IRuleMark = IMarkRaw<IRuleMarkSpec>;
export type ISymbolMark = IMarkRaw<ISymbolMarkSpec>;
export interface IGroupMark extends IMarkRaw<IGroupMarkSpec> {
    addMark: (m: IMark) => boolean;
    removeMark: (m: IMark) => boolean;
    getMarks: () => IMark[];
    getMarkInType: (type: MarkType) => IMark[];
    getMarkInId: (id: number) => IMark | undefined;
    getMarkInName: (name: string) => IMark[] | undefined;
}
