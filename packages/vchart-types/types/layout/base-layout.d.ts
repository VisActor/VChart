import type { utilFunctionCtx } from '../typings/params';
import type { IChart } from '../chart/interface/chart';
import type { IBoundsLike } from '@visactor/vutils';
import type { IBaseLayout, ILayoutItem } from './interface';
import type { IPadding, IRect } from '../typings/space';
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
    layoutItems(_chart: IChart, items: ILayoutItem[], chartLayoutRect: IRect, chartViewBox: IBoundsLike): void;
    protected layoutNormalItems(normalItems: ILayoutItem[]): void;
    protected layoutNormalInlineItems(normalItems: ILayoutItem[]): void;
    protected layoutRegionItems(regionItems: ILayoutItem[], regionRelativeItems: ILayoutItem[]): void;
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
