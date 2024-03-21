import type { IFunnelSeriesSpec } from '../../series';
import type { ISeriesSpec } from '../../typings';
import { BaseChartSpecTransformer } from '../base';
import type { IFunnelChartSpec } from './interface';

export class FunnelChartSpecTransformer<T extends IFunnelChartSpec> extends BaseChartSpecTransformer<T> {
  protected needAxes(): boolean {
    return false;
  }

  protected _getDefaultSeriesSpec(spec: T): IFunnelSeriesSpec {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),

      categoryField: spec.categoryField,
      valueField: spec.valueField,
      seriesField: spec.seriesField,

      funnelAlign: spec.funnelAlign,
      funnelOrient: spec.funnelOrient,
      heightRatio: spec.heightRatio,

      shape: spec.shape,
      funnel: spec.funnel,
      transform: spec.transform,
      outerLabel: spec.outerLabel,
      transformLabel: spec.transformLabel,

      isTransform: spec.isTransform,
      maxSize: spec.maxSize,
      minSize: spec.minSize,
      gap: spec.gap,
      isCone: spec.isCone,
      range: spec.range
    };
    const seriesType = this.seriesType;
    if (seriesType) {
      series.type = seriesType;
      series[seriesType] = spec[seriesType];
    }

    return series;
  }
  transformSpec(spec: T): void {
    super.transformSpec(spec);

    const defaultSeriesSpec = this._getDefaultSeriesSpec(spec);
    if (!spec.series || spec.series.length === 0) {
      spec.series = [defaultSeriesSpec];
    } else {
      spec.series.forEach((s: ISeriesSpec) => {
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
