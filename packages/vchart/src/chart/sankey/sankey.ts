import { BaseChart, BaseChartSpecTransformer } from '../base-chart';
import { ChartTypeEnum } from '../interface/type';
import { SeriesTypeEnum } from '../../series/interface/type';
import type { ISankeyChartSpec } from './interface';
import { registerSankeySeries } from '../../series/sankey/sankey';
import { Factory } from '../../core/factory';
import type { ISeriesSpec } from '../..';

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

export class SankeyChart<T extends ISankeyChartSpec = ISankeyChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.sankey;
  static readonly seriesType: string = SeriesTypeEnum.sankey;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = SankeyChartSpecTransformer;
  readonly transformerConstructor = SankeyChartSpecTransformer;
  readonly type: string = ChartTypeEnum.sankey;
  readonly seriesType: string = SeriesTypeEnum.sankey;
}

export const registerSankeyChart = () => {
  registerSankeySeries();
  Factory.registerChart(SankeyChart.type, SankeyChart);
};
