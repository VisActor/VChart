import type { utilFunctionCtx } from '../typings/params';
import type { IChart } from '../chart/interface/chart';
import type { IBoundsLike } from '@visactor/vutils';
import type { IBaseLayout, ILayoutItem } from './interface';
import type { IOrientType, IPadding, IRect } from '../typings/space';
import type { ILayoutRect } from '../typings/layout';
export type LayoutSideType = {
    top: number;
    left: number;
    bottom: number;
    right: number;
};
export interface IOffset {
    offsetLeft: number;
    offsetRight: number;
    offsetTop: number;
    offsetBottom: number;
}
type overlapInfo = {
    items: ILayoutItem[];
    rect: ILayoutRect;
};
export declare class Layout implements IBaseLayout {
    static type: string;
    leftCurrent: number;
    topCurrent: number;
    rightCurrent: number;
    bottomCurrent: number;
    _chartLayoutRect: IRect;
    _chartViewBox: IBoundsLike;
    protected _onError: (msg: string) => void;
    constructor(_spec?: unknown, ctx?: utilFunctionCtx);
    protected _layoutInit(_chart: IChart, items: ILayoutItem[], chartLayoutRect: IRect, chartViewBox: IBoundsLike): void;
    protected _layoutNormalItems(items: ILayoutItem[]): void;
    protected _groupItems(items: ILayoutItem[]): {
        regionItems: ILayoutItem[];
        relativeItems: ILayoutItem[];
        relativeOverlapItems: ILayoutItem[];
        allRelatives: ILayoutItem[];
        overlapItems: {
            left: overlapInfo;
            right: overlapInfo;
            top: overlapInfo;
            bottom: overlapInfo;
            z: overlapInfo;
        };
    };
    layoutItems(_chart: IChart, items: ILayoutItem[], chartLayoutRect: IRect, chartViewBox: IBoundsLike): void;
    protected _processAutoIndent(regionItems: ILayoutItem[], relativeItems: ILayoutItem[], relativeOverlapItems: ILayoutItem[], overlapItems: {
        [key in IOrientType]: overlapInfo;
    }, allRelatives: ILayoutItem[], layoutTemp: LayoutSideType): void;
    protected layoutNormalItems(normalItems: ILayoutItem[]): void;
    protected layoutNormalInlineItems(normalItems: ILayoutItem[]): void;
    protected _layoutRelativeOverlap(orient: IOrientType, info: overlapInfo): void;
    protected _layoutRelativeItem(item: ILayoutItem, layoutRect: ILayoutRect): void;
    protected _layoutRegionItem(regionItems: ILayoutItem[], regionRelativeTotalWidth: number, regionRelativeTotalHeight: number): {
        regionHeight: number;
        regionWidth: number;
    };
    protected layoutRegionItems(regionItems: ILayoutItem[], regionRelativeItems: ILayoutItem[], regionRelativeOverlapItems: ILayoutItem[], overlapItems?: {
        [key in IOrientType]: overlapInfo;
    }): void;
    protected layoutAbsoluteItems(absoluteItems: ILayoutItem[]): void;
    filterRegionsWithID(items: ILayoutItem[], id: number): ILayoutItem;
    getItemComputeLayoutRect(item: ILayoutItem): {
        width: number;
        height: number;
    };
    protected _checkAutoIndent(items: ILayoutItem[], layoutTemp: {
        top: number;
        left: number;
        bottom: number;
        right: number;
    }): IPadding;
    private _getOutInLayout;
}
export {};
