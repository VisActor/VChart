import type { Datum } from '../../typings';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';

export class CirclePackingTooltipHelper extends BaseSeriesTooltipHelper {
  contentKeyCallback = (datum: Datum) => {
    return datum?.[this.series.getDimensionField()[0]];
  };
}
