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
