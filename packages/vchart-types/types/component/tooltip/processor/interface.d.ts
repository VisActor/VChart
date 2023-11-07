import type { Datum } from '@visactor/vgrammar-core';
import type { IMark } from '../../../mark/interface';
import type { ISeries } from '../../../series/interface';
import type { IDimensionInfo } from '../../../event/events/dimension/interface';
export type DimensionTooltipInfo = IDimensionInfo[];
export type MarkTooltipInfo = {
    datum: Datum;
    mark: IMark;
    series: ISeries;
    dimensionInfo: DimensionTooltipInfo;
};
export type TooltipInfo = DimensionTooltipInfo | MarkTooltipInfo;
export type MouseEventData = {
    tooltipInfo: TooltipInfo;
    ignore: boolean;
};
