import type { MaybeArray } from '../common';
import type { TooltipPatternProperty, TooltipUpdateCallback } from './common';
import type { TooltipActiveType } from './handler';
import type { IToolTipLineActual, IToolTipLinePattern } from './line';
import type { ITooltipPositionActual, TooltipPositionMode, TooltipPosition } from './position';
import type { ITooltipShapePattern } from './shape';
export interface ITooltipPattern extends ITooltipShapePattern {
    visible?: TooltipPatternProperty<boolean>;
    title?: TooltipPatternProperty<IToolTipLinePattern>;
    content?: MaybeArray<TooltipPatternProperty<MaybeArray<IToolTipLinePattern>>>;
    position?: TooltipPatternProperty<TooltipPosition>;
    positionMode?: TooltipPatternProperty<TooltipPositionMode>;
    updateTitle?: TooltipUpdateCallback<IToolTipLineActual>;
    updateContent?: TooltipUpdateCallback<IToolTipLineActual[]>;
    updatePosition?: TooltipUpdateCallback<ITooltipPositionActual>;
    maxLineCount?: number;
    activeType?: TooltipActiveType;
}
export interface IToolTipActual {
    visible?: boolean;
    title?: IToolTipLineActual;
    content?: IToolTipLineActual[];
    activeType?: TooltipActiveType;
    position?: ITooltipPositionActual;
}
