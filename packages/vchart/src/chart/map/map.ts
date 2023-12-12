import { registerMapSeries } from '../../series/map/map';
import { BaseChart, BaseChartSpecTransformer } from '../base-chart';
import type { IRegionSpec } from '../../region/interface';
import { SeriesTypeEnum } from '../../series/interface/type';
import { ChartTypeEnum } from '../interface/type';
import type { IMapChartSpec } from './interface';
import type { IMapSeriesSpec } from '../../series/map/interface';
import type { ISeriesSpec } from '../../typings/spec';
import { Factory } from '../../core/factory';

export class MapChartSpecTransformer<T extends IMapChartSpec = IMapChartSpec> extends BaseChartSpecTransformer<T> {
  protected _isValidSeries(type: string) {
    return type === SeriesTypeEnum.map;
  }

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

  transformSpec(spec: T): void {
    super.transformSpec(spec);

    spec.region.forEach((r: IRegionSpec) => {
      r.coordinate = 'geo';
    });

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

export class MapChart<T extends IMapChartSpec = IMapChartSpec> extends BaseChart<T> {
  static readonly type: string = ChartTypeEnum.map;
  static readonly seriesType: string = SeriesTypeEnum.map;
  static readonly view: string = 'singleDefault';
  static readonly transformerConstructor = MapChartSpecTransformer;
  readonly transformerConstructor = MapChartSpecTransformer;
  readonly type: string = ChartTypeEnum.map;
  readonly seriesType: string = SeriesTypeEnum.map;
}

export const registerMapChart = () => {
  registerMapSeries();
  Factory.registerChart(MapChart.type, MapChart);
};
