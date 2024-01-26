import type { IToolTipActual, Maybe } from '../../../../../typings';
import type { IDomTooltipStyle } from '../interface';
import type { ITooltipAttributes } from '../../interface';
export interface ITooltipModelOption {
    valueToHtml: (value: any) => string;
    getTooltipStyle: () => IDomTooltipStyle;
    getTooltipActual: () => Maybe<IToolTipActual>;
    getTooltipAttributes: () => Maybe<ITooltipAttributes>;
    getContainer: () => HTMLElement;
}
