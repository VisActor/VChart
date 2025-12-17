import type { ICompareSankeyDiffChartSpecBase, ICompareSankeyDiffSeriesSpec } from './interface';
import { SankeyChartSpecTransformer } from '@visactor/vchart';

/**
 * compare-sankey-diff 图表规格转换器
 */
// @ts-expect-error
export class CompareSankeyDiffChartSpecTransformer extends SankeyChartSpecTransformer<ICompareSankeyDiffChartSpecBase> {
  seriesType = 'compareSankeyDiff';
  /**
   * 转换外部传入的图表规格
   */
  transformSpec(spec: ICompareSankeyDiffChartSpecBase): void {
    super.transformSpec(spec);
  }

  /**
   * 生成默认的系列规格，并将图表级配置下发到系列
   */
  _getDefaultSeriesSpec(spec: ICompareSankeyDiffChartSpecBase) {
    const seriesSpec = super._getDefaultSeriesSpec(spec);
    (seriesSpec as ICompareSankeyDiffSeriesSpec).subNodeGap = spec.subNodeGap;
    (seriesSpec as ICompareSankeyDiffSeriesSpec).subNodeMinSize = spec.subNodeMinSize;
    (seriesSpec as ICompareSankeyDiffSeriesSpec).compareNodeColor = spec.compareNodeColor;
    (seriesSpec as ICompareSankeyDiffSeriesSpec).compareLinkColor = spec.compareLinkColor;
    return seriesSpec;
  }
}
