import type { IChart } from '../../chart/interface/chart';
import type { IBoundsLike } from '@visactor/vutils';
import type { ILayoutItem } from '../../model/interface';
import type { IRect } from '../../typings/space';
import type { IRegion } from '../../region/interface';
import type { IBaseLayout } from '../interface';
import { Layout } from '../base-layout';
interface IOffset {
  offsetLeft: number;
  offsetRight: number;
  offsetTop: number;
  offsetBottom: number;
}
export declare class Layout3d extends Layout implements IBaseLayout {
  layoutItems(_chart: IChart, items: ILayoutItem[], chartLayoutRect: IRect, chartViewBox: IBoundsLike): void;
  protected layoutZAxisItems(zItems: ILayoutItem[], zRect: IRect): void;
  protected layoutRegionItems(regionItems: IRegion[], regionRelativeItems: ILayoutItem[], extraOffset?: IOffset): void;
  getItemComputeLayoutRect(
    item: ILayoutItem,
    extraOffset?: IOffset
  ): {
    width: number;
    height: number;
  };
}
export {};
