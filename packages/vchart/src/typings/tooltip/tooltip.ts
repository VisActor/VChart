import type { MaybeArray } from '../common';
import type { TooltipPatternProperty, TooltipUpdateCallback } from './common';
import type { TooltipActiveType, TooltipData } from './handler';
import type { ITooltipLineActual, ITooltipLinePattern } from './line';
import type { ITooltipPositionActual, TooltipPositionMode, TooltipPosition } from './position';
import type { ITooltipShapePattern } from './shape';

export interface ITooltipPattern extends ITooltipShapePattern {
  visible?: TooltipPatternProperty<boolean>;
  title?: TooltipPatternProperty<ITooltipLinePattern>;
  content?: MaybeArray<TooltipPatternProperty<MaybeArray<ITooltipLinePattern>>>;
  position?: TooltipPatternProperty<TooltipPosition>;
  /**
   * 决定 `position` 相对固定于什么图形，如固定在鼠标指针周围或图元周围。该配置只有 `position` 设为字符串时生效。默认为 `'mark'`
   * @since 1.4.0
   */
  positionMode?: TooltipPatternProperty<TooltipPositionMode>;

  updateTitle?: TooltipUpdateCallback<ITooltipLineActual>;
  updateContent?: TooltipUpdateCallback<ITooltipLineActual[]>;
  updatePosition?: TooltipUpdateCallback<ITooltipPositionActual>;

  /** tooltip content 保留的最大数据行数，默认为 20 */
  maxLineCount?: number;

  /** 方便内部逻辑辨别 tooltip 类型，不暴露给用户 */
  activeType?: TooltipActiveType;
}

export type GroupTooltipTriggerMark = 'line' | 'area' | 'point' | 'bar';

export interface IGroupTooltipPattern extends ITooltipPattern {
  /**
   * group tooltip 的触发 mark
   * @since 1.11.0
   */
  triggerMark?: MaybeArray<GroupTooltipTriggerMark>;
}

export interface ITooltipActual {
  visible?: boolean;
  title?: ITooltipLineActual;
  content?: ITooltipLineActual[];
  activeType?: TooltipActiveType;
  position?: ITooltipPositionActual;
  data?: TooltipData;
}
