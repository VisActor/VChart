import type { TooltipPatternProperty, TooltipUpdateCallback } from './common';
import type { TooltipActiveType } from './handler';
import type { IToolTipLineActual, IToolTipLinePattern } from './line';
import type { ITooltipPositionActual, TooltipPosition } from './position';
import type { ITooltipShapePattern } from './shape';

export interface ITooltipPattern extends ITooltipShapePattern {
  visible?: TooltipPatternProperty<boolean>;
  title?: TooltipPatternProperty<IToolTipLinePattern>;
  content?: TooltipPatternProperty<IToolTipLinePattern | IToolTipLinePattern[]>;
  position?: TooltipPatternProperty<TooltipPosition>;

  updateTitle?: TooltipUpdateCallback<IToolTipLineActual>;
  updateContent?: TooltipUpdateCallback<IToolTipLineActual[]>;
  updatePosition?: TooltipUpdateCallback<ITooltipPositionActual>;

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
