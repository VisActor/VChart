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

// TODO:
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ILayoutSpec {
  type?: string;
  [key: string]: any;
}

export interface ILayoutConstructor {
  type: string;
  // TODO: spec 类型生命
  new (spec: ILayoutSpec | any): IBaseLayout;
}
