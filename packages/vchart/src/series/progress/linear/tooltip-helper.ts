import { BaseSeriesTooltipHelper } from '../../base/tooltip-helper';
import type { ISeriesTooltipHelper } from '../../interface';
import type { ITooltipPattern, TooltipActiveType } from '../../../typings';
import type { IDimensionInfo } from '../../../event/events/dimension/interface';

export class LinearProgressSeriesTooltipHelper extends BaseSeriesTooltipHelper implements ISeriesTooltipHelper {
  /** 获取默认的tooltip pattern */
  getDefaultTooltipPattern(activeType: TooltipActiveType, dimensionInfo?: IDimensionInfo[]): ITooltipPattern | null {
    const result = super.getDefaultTooltipPattern(activeType, dimensionInfo);
    switch (activeType) {
      case 'mark':
      case 'group':
        return result;
      case 'dimension':
        result.visible = false;
        return result;
    }
    return null;
  }
}
