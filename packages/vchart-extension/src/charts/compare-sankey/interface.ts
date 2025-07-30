import type { ISankeyChartSpec, ISankeySeriesSpec, ILinkPathMarkSpec } from '@visactor/vchart';

export interface ICompareSankeySpec {
  /**
   * 子节点间距
   */
  subNodeGap?: number;
  /**
   * 对比节点颜色
   */
  compareNodeColor?: { [key: string]: string };
  /**
   * 对比边点颜色
   */
  compareLinkColor?: { [key: string]: string };
  /**
   * 对比边样式
   */
  activeLink?: {
    style: ILinkPathMarkSpec;
  };
}

export interface ICompareSankeySeriesSpecBase extends ISankeySeriesSpec, ICompareSankeySpec {}

export interface ICompareSankeyChartSpecBase extends ISankeyChartSpec, ICompareSankeySpec {}

export interface ICompareSankeySeriesSpec extends Omit<ICompareSankeySeriesSpecBase, 'type' | 'series'> {
  type: 'compareSankey';
}

export interface ICompareSankeyChartSpec extends Omit<ICompareSankeyChartSpecBase, 'type' | 'series'> {
  type: 'compareSankey';
}
