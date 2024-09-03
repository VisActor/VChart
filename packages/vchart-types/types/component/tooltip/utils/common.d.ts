import type { ITooltipPattern, TooltipActiveType } from '../../../typings';
import type { ITooltipSpec } from '../interface';
import type { BaseEventParams } from '../../../event/interface';
export declare const getTooltipActualActiveType: (spec?: ITooltipSpec) => TooltipActiveType[];
export declare const isActiveTypeVisible: (type: TooltipActiveType, spec?: ITooltipSpec) => boolean;
export declare function isEmptyPos(params: BaseEventParams): boolean;
export declare function combinePattern(patternList: ITooltipPattern[]): ITooltipPattern;
