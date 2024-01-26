import type { ICirclePackingSeriesSpec } from '../../series/circle-packing/interface';
import { SeriesTypeEnum } from '../../series/interface';
import { BaseChartSpecTransformer } from '../base';
import type { ICirclePackingChartSpec } from './interface';

export class CirclePackingChartSpecTransformer<
  T extends ICirclePackingChartSpec = ICirclePackingChartSpec
> extends BaseChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: ICirclePackingChartSpec) {
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

  transformSpec(spec: T): void {
    super.transformSpec(spec);
    this.transformSeriesSpec(spec);
  }
}
