import type { utilFunctionCtx } from '../typings/params';
import type { IRect } from '../typings/space';
import type { ILayoutItem } from '../model/interface';
import type { IBoundsLike } from '@visactor/vutils';
import type { IChart } from '../chart/interface';

export interface IBaseLayout {
  /**
   * 对一组布局元素布局
   * 布局策略随意
   * @param item 布局元素数组
   * @param chartLayoutRect 排除图表 padding 后的图表的布局矩形，原点是图表绘制区域左上角。
   * @param chartViewBox 图表在画布中的可用空间，包含图表padding，原点是画布左上角
   * @returns
   */
  layoutItems: LayoutCallBack;
}

export type LayoutCallBack = (
  chart: IChart,
  item: ILayoutItem[],
  chartLayoutRect: IRect,
  chartViewBox: IBoundsLike
) => void;

export interface ILayoutSpecBase {
  type: string;
}

export type ElementSpec = (
  | {
      modelKey: string; // spec key
      modelIndex: number;
    }
  | {
      modelId: string;
    }
) & {
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
  // TODO: spec 类型生命
  new (spec: ILayoutSpec | any, ctx?: utilFunctionCtx): IBaseLayout;
}
