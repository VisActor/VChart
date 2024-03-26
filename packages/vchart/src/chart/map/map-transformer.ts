import type { IMapSeriesSpec } from '../../series';
// eslint-disable-next-line no-duplicate-imports
import { SeriesTypeEnum } from '../../series';
import type { RegionSpec, ISeriesSpec } from '../../typings';
import { BaseChartSpecTransformer } from '../base';
import type { IMapChartSpec } from './interface';

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

      defaultFillColor: spec.defaultFillColor,
      showDefaultName: spec.showDefaultName
    };

    return series;
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);

    spec.region.forEach((r: RegionSpec) => {
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
