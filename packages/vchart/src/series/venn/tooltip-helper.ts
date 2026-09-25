import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import { getVennSeriesDataKey } from './util';

export class VennTooltipHelper extends BaseSeriesTooltipHelper {
  dimensionTooltipTitleCallback = (datum: any) => {
    return getVennSeriesDataKey(datum?.[this.series.getDimensionField()[0]], this.series.getSpec().emptySetKey);
  };

  markTooltipKeyCallback = (datum: any) => {
    return getVennSeriesDataKey(datum?.[this.series.getDimensionField()[0]], this.series.getSpec().emptySetKey);
  };
}
