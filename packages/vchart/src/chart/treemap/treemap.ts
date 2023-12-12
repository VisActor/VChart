import type { ISeries } from '../../series/interface';
// eslint-disable-next-line no-duplicate-imports
import { SeriesTypeEnum } from '../../series/interface/type';
import { BaseChart, BaseChartSpecTransformer } from '../base-chart';
import { ChartTypeEnum } from '../interface/type';
import type { ITreemapChartSpec } from './interface';
import { registerTreemapSeries } from '../../series/treemap/treemap';
import { Factory } from '../../core/factory';
import type { AdaptiveSpec } from '../..';

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

    /* 处理 series 配置 */
    const defaultSeriesSpec = this._getDefaultSeriesSpec(spec);
    if (!spec.series || spec.series.length === 0) {
      spec.series = [defaultSeriesSpec];
    } else {
      spec.series.forEach((s: ISeries) => {
        if (!this._isValidSeries(s.type)) {
          return;
        }
        Object.keys(defaultSeriesSpec).forEach(k => {
          if (!(k in s)) {
            s[k] = defaultSeriesSpec[k];
          }
        });
      });
    }
  }
}

export class TreemapChart<T extends ITreemapChartSpec = ITreemapChartSpec> extends BaseChart<
  AdaptiveSpec<T, 'data' | 'series'>
> {
  static readonly type: string = ChartTypeEnum.treemap;
  static readonly seriesType: string = SeriesTypeEnum.treemap;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = TreemapChartSpecTransformer;
  readonly transformerConstructor = TreemapChartSpecTransformer;
  readonly type: string = ChartTypeEnum.treemap;
  readonly seriesType: string = SeriesTypeEnum.treemap;
}

export const registerTreemapChart = () => {
  registerTreemapSeries();
  Factory.registerChart(TreemapChart.type, TreemapChart);
};
