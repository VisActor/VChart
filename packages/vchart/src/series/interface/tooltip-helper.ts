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
  contentKeyCallback: TooltipContentCallback<string>;
  contentValueCallback: TooltipContentCallback<string>;
  contentShapeTypeCallback: TooltipContentCallback<ShapeType>;
  contentShapeColorCallback: TooltipContentCallback<string>;
  titleValueCallback: TooltipContentCallback<string>;
}
