import { registerCorrelationSeries } from '../../series/correlation/correlation';
import { BaseChart } from '../base-chart';
import { ChartTypeEnum } from '../interface/type';
import { SeriesTypeEnum } from '../../series/interface/type';
import type { ICorrelationChartSpec } from './interface';
import type { ICorrelationSeriesSpec } from '../../series/correlation/interface';
import { Factory } from '../../core/factory';

export class CorrelationChart extends BaseChart {
  static readonly type: string = ChartTypeEnum.correlation;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.correlation;
  readonly seriesType: string = SeriesTypeEnum.correlation;

  protected _getDefaultSeriesSpec(spec: ICorrelationChartSpec): any {
    const series: ICorrelationSeriesSpec = {
      ...super._getDefaultSeriesSpec(spec),
      categoryField: spec.categoryField,
      valueField: spec.valueField,
      seriesField: spec.seriesField,
      sizeField: spec.sizeField,
      sizeRange: spec.sizeRange,

      centerX: spec.centerX,
      centerY: spec.centerY,
      innerRadius: spec.innerRadius,
      outerRadius: spec.outerRadius,
      startAngle: spec.startAngle,
      endAngle: spec.endAngle,

      ripplePoint: spec.ripplePoint,
      centerPoint: spec.centerPoint,
      centerLabel: spec.centerLabel,
      nodePoint: spec.nodePoint,
      label: spec.label
    };
    const seriesType = SeriesTypeEnum.correlation;
    series.type = seriesType;
    series[seriesType] = spec[seriesType];

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

export const registerCorrelationChart = () => {
  registerCorrelationSeries();
  Factory.registerChart(CorrelationChart.type, CorrelationChart);
};
