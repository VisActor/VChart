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
