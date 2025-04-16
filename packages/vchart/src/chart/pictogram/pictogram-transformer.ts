// eslint-disable-next-line no-duplicate-imports
import { SeriesTypeEnum } from '../../series';
import type { IPictogramSeriesSpec } from '../../series/pictogram/interface';
import type { RegionSpec, ISeriesSpec } from '../../typings';
import { BaseChartSpecTransformer } from '../base';
import type { IPictogramChartSpec } from './interface';

export class PictogramChartSpecTransformer<
  T extends IPictogramChartSpec = IPictogramChartSpec
> extends BaseChartSpecTransformer<T> {
  protected _isValidSeries(type: string) {
    return type === SeriesTypeEnum.pictogram;
  }

  protected _getDefaultSeriesSpec(spec: IPictogramChartSpec): IPictogramSeriesSpec {
    return super._getDefaultSeriesSpec(spec, [
      'type',
      'nameField',
      'valueField',
      'svg',
      'pictogram',
      'defaultFillColor'
    ]);
  }

  transformSpec(spec: T): void {
    super.transformSpec(spec);

    spec.region.forEach((r: RegionSpec) => {
      r.coordinate = 'geo';
    });

    super.transformSeriesSpec(spec);
  }
}
