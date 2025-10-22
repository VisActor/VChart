import type { ICompareSankeyChartSpecBase } from './interface';
import { SankeyChartSpecTransformer } from '@visactor/vchart';

export class CompareSankeyChartSpecTransformer extends SankeyChartSpecTransformer<ICompareSankeyChartSpecBase> {
  seriesType = 'compareSankey';
  transformSpec(spec: ICompareSankeyChartSpecBase): void {
    super.transformSpec(spec);
  }

  _getDefaultSeriesSpec(spec: ICompareSankeyChartSpecBase) {
    const seriesSpec = super._getDefaultSeriesSpec(spec);
    (seriesSpec as ICompareSankeyChartSpecBase).subNodeGap = spec.subNodeGap;
    (seriesSpec as ICompareSankeyChartSpecBase).subNodeMinSize = spec.subNodeMinSize;
    (seriesSpec as ICompareSankeyChartSpecBase).compareNodeColor = spec.compareNodeColor;
    (seriesSpec as ICompareSankeyChartSpecBase).compareLinkColor = spec.compareLinkColor;
    (seriesSpec as ICompareSankeyChartSpecBase).activeLink = spec.activeLink;
    return seriesSpec;
  }
}
