import type { ISeriesSpec } from '../../typings';
import { BaseChartSpecTransformer } from '../base';
import type { ISankeyChartSpec } from './interface';

export class SankeyChartSpecTransformer<
  T extends ISankeyChartSpec = ISankeyChartSpec
> extends BaseChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),
      categoryField: spec.categoryField,
      valueField: spec.valueField,
      sourceField: spec.sourceField,
      targetField: spec.targetField,

      direction: spec.direction,
      nodeAlign: spec.nodeAlign,
      nodeGap: spec.nodeGap,
      nodeWidth: spec.nodeWidth,
      linkWidth: spec.linkWidth,
      minStepWidth: spec.minStepWidth,
      minNodeHeight: spec.minNodeHeight,
      minLinkHeight: spec.minLinkHeight,
      iterations: spec.iterations,
      nodeKey: spec.nodeKey,
      linkSortBy: spec.linkSortBy,
      nodeSortBy: spec.nodeSortBy,
      setNodeLayer: spec.setNodeLayer,

      node: spec.node,
      link: spec.link,
      label: spec.label,

      emphasis: spec.emphasis
    };
    const seriesType = this.seriesType;
    if (seriesType) {
      series.type = seriesType;
      series[seriesType] = spec[seriesType];
    }

    return series;
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);

    /* 处理 series 配置 */
    const defaultSeriesSpec = this._getDefaultSeriesSpec(spec);
    if (!spec.series || spec.series.length === 0) {
      spec.series = [defaultSeriesSpec];
    } else {
      spec.series.forEach((s: ISeriesSpec) => {
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
