import type { TooltipActiveType, TooltipData } from './handler';
import type { IToolTipLineActual, IToolTipLinePattern } from './line';
import type { ITooltipPositionActual, TooltipPosition } from './position';
import type { ITooltipShapePattern } from './shape';

export interface ITooltipPattern extends ITooltipShapePattern {
  visible?: boolean;
  title?: IToolTipLinePattern;
  content?: IToolTipLinePattern[];
  position?: TooltipPosition;
  updateTitle?: (prev: IToolTipLineActual | undefined, data: TooltipData) => IToolTipLineActual | undefined;
  updateContent?: (prev: IToolTipLineActual[] | undefined, data: TooltipData) => IToolTipLineActual[] | undefined;
  updatePosition?: (prev: ITooltipPositionActual | undefined, data: TooltipData) => ITooltipPositionActual | undefined;
  /** 方便内部逻辑辨别 tooltip 类型，不暴露给用户 */
  activeType?: TooltipActiveType;
}

export interface IToolTipActual {
  visible?: boolean;
  title?: IToolTipLineActual;
  content?: IToolTipLineActual[];
  activeType?: TooltipActiveType;
  position?: ITooltipPositionActual;
}
