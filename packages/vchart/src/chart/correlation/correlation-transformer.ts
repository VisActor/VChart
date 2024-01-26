import { SeriesTypeEnum, type ICorrelationSeriesSpec } from '../../series';
import { BaseChartSpecTransformer } from '../base';
import type { ICorrelationChartSpec } from './interface';

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
    this.transformSeriesSpec(spec);
  }
}
