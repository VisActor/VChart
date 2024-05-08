import type { TooltipActiveType } from '../../../typings';
import type { ISeries } from '../../../series/interface';
import type { IDimensionInfo } from '../../../event/events/dimension/interface';
import type { ITooltipSpec } from '..';
export declare const getTooltipSpecForShow: (activeType: TooltipActiveType, globalSpec: ITooltipSpec, series?: ISeries, dimensionInfo?: IDimensionInfo[]) => ITooltipSpec;
