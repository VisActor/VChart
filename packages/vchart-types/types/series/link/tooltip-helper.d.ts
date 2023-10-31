import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { ITooltipPattern, TooltipActiveType } from '../../typings';
export declare class LinkSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
    getDefaultTooltipPattern(activeType: TooltipActiveType): ITooltipPattern | null;
}
