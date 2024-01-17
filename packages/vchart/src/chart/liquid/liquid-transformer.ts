import { SeriesTypeEnum } from '../../series';
import { BaseChartSpecTransformer } from '../base';
import type { ILiquidChartSpec } from './interface';

export class LiquidChartSpecTransformer<
  T extends ILiquidChartSpec = ILiquidChartSpec
> extends BaseChartSpecTransformer<T> {
  protected _getDefaultSeriesSpec(spec: T): any {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),
      valueField: spec.valueField,
      maskShape: spec.maskShape,
      outlineMargin: spec.outlineMargin,
      outlinePadding: spec.outlinePadding,
      indicatorSmartInvert: spec.indicatorSmartInvert,
      liquidBackground: spec.liquidBackground,
      liquidOutline: spec.liquidOutline
    };
    const seriesType = SeriesTypeEnum.liquid;
    if (seriesType) {
      series.type = seriesType;
      series[seriesType] = spec[seriesType];
    }

    return series;
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);
    this.transformSeriesSpec(spec);
  }
}
