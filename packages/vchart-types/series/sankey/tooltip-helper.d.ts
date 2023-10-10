import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { ITooltipPattern, TooltipActiveType } from '../../typings';
import type { IDimensionInfo } from '../../event/events/dimension/interface';
export declare class SankeySeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  getDefaultTooltipPattern(activeType: TooltipActiveType, dimensionInfo?: IDimensionInfo[]): ITooltipPattern | null;
}
