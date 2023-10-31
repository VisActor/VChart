import type { utilFunctionCtx } from '../typings/params';
import type { IRect } from '../typings/space';
import type { ILayoutItem } from '../model/interface';
import type { IBoundsLike } from '@visactor/vutils';
import type { IChart } from '../chart/interface';
export interface IBaseLayout {
    layoutItems: LayoutCallBack;
}
export type LayoutCallBack = (chart: IChart, item: ILayoutItem[], chartLayoutRect: IRect, chartViewBox: IBoundsLike) => void;
export interface ILayoutSpecBase {
    type: string;
}
export type ElementSpec = ({
    modelKey: string;
    modelIndex: number;
} | {
    modelId: string;
}) & {
    col: number;
    colSpan?: number;
    row: number;
    rowSpan?: number;
};
export interface IGridLayoutSpec extends ILayoutSpecBase {
    type: 'grid';
    col: number;
    row: number;
    colWidth?: {
        index: number;
        size: number | ((maxSize: number) => number);
    }[];
    rowHeight?: {
        index: number;
        size: number | ((maxSize: number) => number);
    }[];
    elements: ElementSpec[];
}
export interface IBaseLayoutSpec extends ILayoutSpecBase {
    type: 'base';
}
export type ILayoutSpec = IBaseLayoutSpec | IGridLayoutSpec;
export interface ILayoutConstructor {
    type: string;
    new (spec: ILayoutSpec | any, ctx?: utilFunctionCtx): IBaseLayout;
}
