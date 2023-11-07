import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
export declare class MapSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
    titleValueCallback: (datum: any) => any;
}
