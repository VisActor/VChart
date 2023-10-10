import type { ISeriesTooltipHelper } from '../interface';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { ITooltipPattern, TooltipActiveType } from '../../typings';
export declare class DotSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  updateTooltipSpec(): void;
  getDefaultTooltipPattern(activeType: TooltipActiveType): ITooltipPattern | null;
}
