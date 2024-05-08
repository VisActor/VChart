import type { ITooltipPattern, ShapeType, TooltipActiveType, TooltipContentCallback } from '../../typings';
import type { ISeries } from './series';
import type { ITooltipHelper } from '../../model/tooltip-helper';
import type { IDimensionInfo } from '../../event/events/dimension/interface';
export interface ISeriesTooltipHelper extends ITooltipHelper {
    series: ISeries;
    getDefaultTooltipPattern: (activeType: TooltipActiveType, dimensionInfo?: IDimensionInfo[]) => ITooltipPattern | null;
    markTooltipKeyCallback: TooltipContentCallback<string>;
    markTooltipValueCallback: TooltipContentCallback<string>;
    shapeTypeCallback: TooltipContentCallback<ShapeType>;
    shapeColorCallback: TooltipContentCallback<string>;
    shapeStrokeCallback: TooltipContentCallback<string>;
    dimensionTooltipTitleCallback: TooltipContentCallback<string>;
    groupTooltipTitleCallback: TooltipContentCallback<string>;
    groupTooltipKeyCallback: TooltipContentCallback<string>;
}
