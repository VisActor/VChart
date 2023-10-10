import type { utilFunctionCtx } from '../typings/params';
import type { IChart } from '../chart/interface/chart';
import type { IBoundsLike } from '@visactor/vutils';
import type { ILayoutItem } from '../model/interface';
import type { IBaseLayout } from './interface';
import type { IPadding, IRect } from '../typings/space';
import type { IRegion } from '../region/interface';
export declare class Layout implements IBaseLayout {
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
  protected layoutRegionItems(regionItems: IRegion[], regionRelativeItems: ILayoutItem[]): void;
  protected layoutAbsoluteItems(absoluteItems: ILayoutItem[]): void;
  filterRegionsWithID(regions: IRegion[], id: number): ILayoutItem;
  getItemComputeLayoutRect(item: ILayoutItem): {
    width: number;
    height: number;
  };
  protected _checkAutoIndent(items: ILayoutItem[]): IPadding;
}
