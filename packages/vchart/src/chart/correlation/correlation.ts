import { BaseChart } from '../base-chart';
import { ChartTypeEnum } from '../interface';
import { SeriesTypeEnum } from '../../series/interface';
import type { ICorrelationChartSpec } from './interface';
import type { ICorrelationSeriesSpec } from '../../series/correlation/interface';
import { VChart } from '../../core/vchart';
import { CorrelationSeries } from '../../series/correlation/correlation';
VChart.useSeries([CorrelationSeries]);

export class CorrelationChart extends BaseChart {
  static readonly type: string = ChartTypeEnum.correlation;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.correlation;
  readonly seriesType: string = SeriesTypeEnum.correlation;

  protected getDefaultSeriesSpec(spec: ICorrelationChartSpec) {
    const series: ICorrelationSeriesSpec = {
      ...super._getDefaultSeriesSpec(spec),
      categoryField: spec.categoryField,
      valueField: spec.valueField,
      seriesField: spec.seriesField,
      sizeField: spec.sizeField,
      sizeRange: spec.sizeRange,

      center: spec.center,
      innerRadius: spec.innerRadius,
      outerRadius: spec.outerRadius,
      startAngle: spec.startAngle,
      endAngle: spec.endAngle,

      ripplePoint: spec.ripplePoint,
      centerPoint: spec.centerPoint,
      centerLabel: spec.centerLabel,
      point: spec.point,
      label: spec.label
    };
    const seriesType = SeriesTypeEnum.correlation;
    if (seriesType) {
      series.type = seriesType;
      series[seriesType] = spec[seriesType];
    }

    return series;
  }

  transformSpec(spec: ICorrelationChartSpec): void {
    super.transformSpec(spec);

    /* 处理 series 配置 */
    const defaultSeriesSpec = this._getDefaultSeriesSpec(spec);
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
