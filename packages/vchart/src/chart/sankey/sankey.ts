import { BaseChart } from '../base-chart';
import { ChartTypeEnum } from '../interface/type';
import { SeriesTypeEnum } from '../../series/interface/type';
import type { ISankeyChartSpec } from './interface';
// eslint-disable-next-line no-duplicate-imports
import type { ISeries } from '../../series/interface';
import { VChart } from '../../core/vchart';
import { SankeySeries, registerSankeySeries } from '../../series/sankey/sankey';
import { Factory } from '../../core/factory';

export class SankeyChart extends BaseChart {
  static readonly type: string = ChartTypeEnum.sankey;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.sankey;
  readonly seriesType: string = SeriesTypeEnum.sankey;

  protected getDefaultSeriesSpec(spec: ISankeyChartSpec): any {
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

  transformSpec(spec: any): void {
    super.transformSpec(spec);

    /* 处理 series 配置 */
    const defaultSeriesSpec = this.getDefaultSeriesSpec(spec);
    if (!spec.series || spec.series.length === 0) {
      spec.series = [defaultSeriesSpec];
    } else {
      spec.series.forEach((s: ISeries) => {
        if (!this.isValidSeries(s.type)) {
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

export const registerSankeyChart = () => {
  registerSankeySeries();
  Factory.registerChart(SankeyChart.type, SankeyChart);
};
