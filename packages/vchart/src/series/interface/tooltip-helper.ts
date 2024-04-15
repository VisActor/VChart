import type { ITooltipPattern, ShapeType, TooltipActiveType, TooltipContentCallback } from '../../typings';
import type { ISeries } from './series';
import type { ITooltipHelper } from '../../model/tooltip-helper';
import type { IDimensionInfo } from '../../event/events/dimension/interface';

export interface ISeriesTooltipHelper extends ITooltipHelper {
  /** 对应系列 */
  series: ISeries;

  /** 获得默认tooltip pattern */
  getDefaultTooltipPattern: (activeType: TooltipActiveType, dimensionInfo?: IDimensionInfo[]) => ITooltipPattern | null;

  // 可以继承的原子化回调
  markTooltipKeyCallback: TooltipContentCallback<string>;
  markTooltipValueCallback: TooltipContentCallback<string>;
  shapeTypeCallback: TooltipContentCallback<ShapeType>;
  shapeColorCallback: TooltipContentCallback<string>;
  dimensionTooltipTitleCallback: TooltipContentCallback<string>;
  groupTooltipTitleCallback: TooltipContentCallback<string>;
  groupTooltipKeyCallback: TooltipContentCallback<string>;
}
