import type { ISankeyChartSpec, ISankeySeriesSpec } from '@visactor/vchart';

export interface ICompareSankeyDiffSpec {
  /**
   * 子节点间距
   */
  subNodeGap?: number;
  /**
   * 子节点最小高度
   */
  subNodeMinSize?: number;
  /**
   * 对比节点颜色
   */
  compareNodeColor?: { [key: string]: string };
  /**
   * 对比边点颜色
   */
  compareLinkColor?: { [key: string]: string };

  /**
   * 强调配置
   */
  emphasis?: Omit<ISankeySeriesSpec['emphasis'], 'effect'> & {
    effect?: ISankeySeriesSpec['emphasis']['effect'] | 'related-node';
  };
}
/**
 * compare-sankey-diff 图表的系列配置基类
 */
export interface ICompareSankeyDiffSeriesSpecBase extends Omit<ISankeySeriesSpec, 'emphasis'>, ICompareSankeyDiffSpec {}

/**
 * compare-sankey-diff 图表的图表配置基类
 */
export interface ICompareSankeyDiffChartSpecBase extends Omit<ISankeyChartSpec, 'emphasis'>, ICompareSankeyDiffSpec {}

/**
 * compare-sankey-diff 系列配置（设置系列类型）
 */
export interface ICompareSankeyDiffSeriesSpec extends Omit<ICompareSankeyDiffSeriesSpecBase, 'type' | 'series'> {
  type: 'compareSankeyDiff';
}

/**
 * compare-sankey-diff 图表配置（设置图表类型）
 */
export interface ICompareSankeyDiffChartSpec extends Omit<ICompareSankeyDiffChartSpecBase, 'type' | 'series'> {
  type: 'compareSankeyDiff';
}
