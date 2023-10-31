import type { Datum, IShowTooltipOption, ITooltipHandler, TooltipActiveType } from '../../../typings';
import type { IComponentOption } from '../../interface';
export declare function showTooltip(datum: Datum, options: IShowTooltipOption, tooltipHandler: ITooltipHandler, componentOptions: IComponentOption): TooltipActiveType | 'none';
