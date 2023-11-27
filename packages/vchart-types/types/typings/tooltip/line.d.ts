import type { TooltipContentProperty } from './common';
import type { ITooltipLabelActual, ITooltipLabelPattern } from './label';
import type { ITooltipShapeActual, ITooltipShapePattern } from './shape';
import type { TooltipRichTextAttrs } from '@visactor/vrender-components';
export interface IToolTipLinePattern extends ITooltipShapePattern, ITooltipLabelPattern {
    key?: TooltipContentProperty<string>;
    value?: TooltipContentProperty<string | TooltipRichTextAttrs>;
    visible?: TooltipContentProperty<boolean>;
    isKeyAdaptive?: TooltipContentProperty<boolean>;
    spaceRow?: TooltipContentProperty<number>;
}
export interface IToolTipLineActual extends ITooltipShapeActual, ITooltipLabelActual {
    key?: string;
    value?: string | TooltipRichTextAttrs;
    visible?: boolean;
    isKeyAdaptive?: boolean;
    spaceRow?: number;
    datum?: any;
}
