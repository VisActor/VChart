import type { ITooltipPattern, ShapeType, TooltipActiveType, TooltipContentCallback } from '../../typings';
import type { ISeries } from './series';
import type { ITooltipHelper } from '../../model/tooltip-helper';
import type { IDimensionInfo } from '../../event/events/dimension/interface';
export interface ISeriesTooltipHelper extends ITooltipHelper {
  series: ISeries;
  getDefaultTooltipPattern: (activeType: TooltipActiveType, dimensionInfo?: IDimensionInfo[]) => ITooltipPattern | null;
  contentKeyCallback: TooltipContentCallback<string>;
  contentValueCallback: TooltipContentCallback<string>;
  contentShapeTypeCallback: TooltipContentCallback<ShapeType>;
  contentShapeColorCallback: TooltipContentCallback<string>;
  titleValueCallback: TooltipContentCallback<string>;
}
