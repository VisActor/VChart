import type { MaybeArray } from '../common';
import type { TooltipPatternProperty, TooltipUpdateCallback } from './common';
import type { TooltipActiveType, TooltipData } from './handler';
import type { IToolTipLineActual, IToolTipLinePattern } from './line';
import type { ITooltipPositionActual, TooltipPositionMode, TooltipPosition } from './position';
import type { ITooltipShapePattern } from './shape';

export interface ITooltipPattern extends ITooltipShapePattern {
  visible?: TooltipPatternProperty<boolean>;
  title?: TooltipPatternProperty<IToolTipLinePattern>;
  content?: MaybeArray<TooltipPatternProperty<MaybeArray<IToolTipLinePattern>>>;
  position?: TooltipPatternProperty<TooltipPosition>;
  /**
   * 决定 `position` 相对固定于什么图形，如固定在鼠标指针周围或图元周围。该配置只有 `position` 设为字符串时生效。默认为 `'mark'`
   * @since 1.4.0
   */
  positionMode?: TooltipPatternProperty<TooltipPositionMode>;

  updateTitle?: TooltipUpdateCallback<IToolTipLineActual>;
  updateContent?: TooltipUpdateCallback<IToolTipLineActual[]>;
  updatePosition?: TooltipUpdateCallback<ITooltipPositionActual>;

  /** tooltip content 保留的最大数据行数，默认为 20 */
  maxLineCount?: number;

  /** 方便内部逻辑辨别 tooltip 类型，不暴露给用户 */
  activeType?: TooltipActiveType;
}

export interface IToolTipActual {
  visible?: boolean;
  title?: IToolTipLineActual;
  content?: IToolTipLineActual[];
  activeType?: TooltipActiveType;
  position?: ITooltipPositionActual;
  data?: TooltipData;
}
