import type { TooltipActiveType } from '../../../typings';
import type { ITooltipSpec } from '../interface';
import type { BaseEventParams } from '../../../event/interface';
export declare const getTooltipActualActiveType: (spec?: ITooltipSpec) => TooltipActiveType[];
export declare function isEmptyPos(params: BaseEventParams): boolean;
