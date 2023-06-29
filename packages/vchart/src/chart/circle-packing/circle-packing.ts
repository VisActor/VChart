import type { ICirclePackingSeriesSpec } from '../../series/circle-packing/interface';
import { SeriesTypeEnum } from '../../series/interface';
import { BaseChart } from '../base-chart';
import { ChartTypeEnum } from '../interface';
import type { ICirclePackingChartSpec } from './interface';
import { VChart } from '../../core/vchart';
import { CirclePackingSeries } from '../../series';
VChart.useSeries([CirclePackingSeries]);

export class CirclePackingChart extends BaseChart {
  static readonly type: string = ChartTypeEnum.circlePacking;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.circlePacking;
  readonly seriesType: string = SeriesTypeEnum.circlePacking;

  protected getDefaultSeriesSpec(spec: ICirclePackingChartSpec) {
    const series: ICirclePackingSeriesSpec = {
      ...super._getDefaultSeriesSpec(spec),
      categoryField: spec.categoryField,
      valueField: spec.valueField,
      seriesField: spec.seriesField,

      layoutPadding: spec.layoutPadding,
      label: spec.label,
      circlePacking: spec.circlePacking,

      drill: spec.drill,
      drillField: spec.drillField
    };
    const seriesType = SeriesTypeEnum.circlePacking;
    series.type = seriesType;
    series[seriesType] = spec[seriesType];

    return series;
  }

  transformSpec(spec: ICirclePackingChartSpec): void {
    super.transformSpec(spec);

    /* 处理 series 配置 */
    const defaultSeriesSpec = this.getDefaultSeriesSpec(spec);
    if (!spec.series || spec.series.length === 0) {
      spec.series = [defaultSeriesSpec];
    } else {
      spec.series.forEach(s => {
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
