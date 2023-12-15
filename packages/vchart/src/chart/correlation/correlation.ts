import { registerCorrelationSeries } from '../../series/correlation/correlation';
import { BaseChart, BaseChartSpecTransformer } from '../base-chart';
import { ChartTypeEnum } from '../interface/type';
import { SeriesTypeEnum } from '../../series/interface/type';
import type { ICorrelationChartSpec } from './interface';
import type { ICorrelationSeriesSpec } from '../../series/correlation/interface';
import { Factory } from '../../core/factory';

export class CorrelationChartSpecTransformer<
  T extends ICorrelationChartSpec = ICorrelationChartSpec
> extends BaseChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
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

  transformSpec(spec: T): void {
    super.transformSpec(spec);

    /* 处理 series 配置 */
    const defaultSeriesSpec = this._getDefaultSeriesSpec(spec);
    if (!spec.series || spec.series.length === 0) {
      spec.series = [defaultSeriesSpec];
    } else {
      spec.series.forEach(s => {
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

export class CorrelationChart<T extends ICorrelationChartSpec = ICorrelationChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.correlation;
  static readonly seriesType: string = SeriesTypeEnum.correlation;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = CorrelationChartSpecTransformer;
  readonly transformerConstructor = CorrelationChartSpecTransformer;
  readonly type: string = ChartTypeEnum.correlation;
  readonly seriesType: string = SeriesTypeEnum.correlation;
}

export const registerCorrelationChart = () => {
  registerCorrelationSeries();
  Factory.registerChart(CorrelationChart.type, CorrelationChart);
};
