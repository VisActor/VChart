import type { ISeries } from '../../series';
import type { AdaptiveSpec } from '../../typings';
import { BaseChartSpecTransformer } from '../base';
import type { ITreemapChartSpec } from './interface';

export class TreemapChartSpecTransformer<
  T extends ITreemapChartSpec = ITreemapChartSpec
> extends BaseChartSpecTransformer<AdaptiveSpec<T, 'data' | 'series'>> {
  protected _getDefaultSeriesSpec(spec: T): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),
      categoryField: spec.categoryField,
      valueField: spec.valueField,

      seriesField: spec.seriesField,

      aspectRatio: spec.aspectRatio,
      splitType: spec.splitType,
      maxDepth: spec.maxDepth,
      gapWidth: spec.gapWidth,
      nodePadding: spec.nodePadding,
      minVisibleArea: spec.minVisibleArea,
      minChildrenVisibleArea: spec.minChildrenVisibleArea,
      minChildrenVisibleSize: spec.minChildrenVisibleSize,

      roam: spec.roam,
      drill: spec.drill,
      drillField: spec.drillField,

      leaf: spec.leaf,
      nonLeaf: spec.nonLeaf,
      nonLeafLabel: spec.nonLeafLabel
    };
    const seriesType = this.seriesType;
    if (seriesType) {
      series.type = seriesType;
      series[seriesType] = spec[seriesType];
    }

    return series;
  }

  transformSpec(spec: any): void {
    super.transformSpec(spec);
    this.transformSeriesSpec(spec);
  }
}
