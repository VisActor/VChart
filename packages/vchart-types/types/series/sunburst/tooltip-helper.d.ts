import type { Datum } from '../../typings';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
export declare class SunburstTooltipHelper extends BaseSeriesTooltipHelper {
    contentKeyCallback: (datum: Datum) => any;
}
