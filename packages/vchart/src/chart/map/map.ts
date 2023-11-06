import { registerMapSeries } from '../../series/map/map';
import { BaseChart } from '../base-chart';
import type { IRegionSpec } from '../../region/interface';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import type { IMapChartSpec } from './interface';
import type { IMapSeriesSpec } from '../../series/map/interface';
import type { ISeriesSpec } from '../../typings/spec';
import { Factory } from '../../core/factory';

export class MapChart extends BaseChart {
  static readonly type: string = ChartTypeEnum.map;
  static readonly view: string = 'singleDefault';
  readonly type: string = ChartTypeEnum.map;
  readonly seriesType: string = SeriesTypeEnum.map;

  protected _getDefaultSeriesSpec(spec: IMapChartSpec): IMapSeriesSpec {
    const series: any = {
      ...super._getDefaultSeriesSpec(spec),

      type: spec.type,

      nameField: spec.nameField,
      valueField: spec.valueField,
      seriesField: spec.seriesField,

      map: spec.map,

      nameProperty: spec.nameProperty,
      centroidProperty: spec.centroidProperty,
      nameMap: spec.nameMap,
      area: spec.area,

      defaultFillColor: spec.defaultFillColor
    };

    return series;
  }

  protected isValidSeries(type: string) {
    return type === SeriesTypeEnum.map;
  }

  transformSpec(spec: IMapChartSpec): void {
    super.transformSpec(spec);

    spec.region.forEach((r: IRegionSpec) => {
      r.coordinate = 'geo';
    });

    const defaultSeriesSpec = this._getDefaultSeriesSpec(spec as IMapChartSpec);
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

export const registerMapChart = () => {
  registerMapSeries();
  Factory.registerChart(MapChart.type, MapChart);
};
