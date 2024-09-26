import type { ITooltipPattern, ShapeType, TooltipActiveType, TooltipContentCallback } from '../../typings';
import type { ISeries } from './series';
import type { IDimensionInfo } from '../../event/events/dimension/interface';
import type { ITooltipHelper } from '../../model/interface';
import type { ITooltipSpec } from '../../component/tooltip/interface/spec';

export interface ISeriesTooltipHelper extends ITooltipHelper {
  /** 对应系列 */
  series: ISeries;

  getTooltipPattern: (
    activeType: TooltipActiveType,
    chartTooltipSpec?: ITooltipSpec,
    dimensionInfo?: IDimensionInfo[]
  ) => ITooltipPattern | null;

  /** 获得默认tooltip pattern */
  getDefaultTooltipPattern: (activeType: TooltipActiveType, dimensionInfo?: IDimensionInfo[]) => ITooltipPattern | null;

  // 可以继承的原子化回调
  markTooltipKeyCallback: TooltipContentCallback<string>;
  markTooltipValueCallback: TooltipContentCallback<string>;
  shapeTypeCallback: TooltipContentCallback<ShapeType>;
  shapeColorCallback: TooltipContentCallback<string>;
  shapeStrokeCallback: TooltipContentCallback<string>;
  dimensionTooltipTitleCallback: TooltipContentCallback<string>;
  groupTooltipTitleCallback: TooltipContentCallback<string>;
  groupTooltipKeyCallback: TooltipContentCallback<string>;
}
