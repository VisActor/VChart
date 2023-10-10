import type { ITooltipPattern, TooltipActiveType } from '../../typings';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { IDimensionInfo } from '../../event/events/dimension/interface';
export declare class HeatmapSeriesTooltipHelper extends BaseSeriesTooltipHelper {
  getDefaultTooltipPattern(activeType: TooltipActiveType, dimensionInfo?: IDimensionInfo[]): ITooltipPattern | null;
}
