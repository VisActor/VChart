import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { Datum, ITooltipPattern, TooltipActiveType } from '../../typings';
export declare class LiquidSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
    getDefaultTooltipPattern(activeType: TooltipActiveType): ITooltipPattern | null;
    getContentKey: () => (datum: any) => string;
    getContentValue: () => (datum: any) => any;
    getLiquidFillColor: (datum: Datum) => any;
}
