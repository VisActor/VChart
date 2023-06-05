import type { IFunnelSeriesSpec } from '../../series/funnel/interface';
import type { ISeriesSpec } from '../../typings/spec';
import type { IFunnelChartSpec } from './interface';

import { SeriesTypeEnum } from '../../series/interface';
import { BaseChart } from '../base-chart';
import { ChartTypeEnum } from '../interface';

class BaseFunnelChart extends BaseChart {
  seriesType: string;

  protected needAxes(): boolean {
    return false;
  }

  protected _getDefaultSeriesSpec(spec: IFunnelChartSpec): IFunnelSeriesSpec {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),

      categoryField: spec.categoryField,
      valueField: spec.valueField,
      seriesField: spec.seriesField,

      funnelAlign: spec.funnelAlign,
      funnelOrient: spec.funnelOrient,

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
  transformSpec(spec: IFunnelChartSpec): void {
    super.transformSpec(spec);

    const defaultSeriesSpec = this._getDefaultSeriesSpec(spec);
    if (!spec.series || spec.series.length === 0) {
      spec.series = [defaultSeriesSpec];
    } else {
      spec.series.forEach((s: ISeriesSpec) => {
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

export class FunnelChart extends BaseFunnelChart {
  static readonly type: string = ChartTypeEnum.funnel;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.funnel;
  readonly seriesType: string = SeriesTypeEnum.funnel;
}

export class Funnel3dChart extends BaseFunnelChart {
  static readonly type: string = ChartTypeEnum.funnel3d;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.funnel3d;
  readonly seriesType: string = SeriesTypeEnum.funnel3d;
}
