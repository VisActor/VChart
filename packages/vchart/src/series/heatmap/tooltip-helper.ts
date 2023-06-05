import { isValid } from '@visactor/vutils';
import type { ITooltipPattern, TooltipActiveType } from '../../typings';
import { BaseSeriesTooltipHelper } from '../base/tooltip-helper';
import type { IDimensionInfo } from '../../event/events/dimension/interface';

export class HeatmapSeriesTooltipHelper extends BaseSeriesTooltipHelper {
  /** 获取默认的tooltip pattern */
  getDefaultTooltipPattern(activeType: TooltipActiveType, dimensionInfo?: IDimensionInfo[]): ITooltipPattern | null {
    const pattern = super.getDefaultTooltipPattern(activeType, dimensionInfo);
    if (isValid(pattern) && activeType === 'dimension') {
      pattern.visible = false;
    }
    return pattern;
  }
}
