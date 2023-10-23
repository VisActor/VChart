import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { MapSeries } from './map';

export class MapSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  titleValueCallback = (datum: any) => {
    const series = this.series as MapSeries;
    return this._getDimensionData(datum) ?? series.getDatumName(datum);
  };
}
